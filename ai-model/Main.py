import json
from openai import OpenAI
import numpy as np
import pandas as pd
import joblib
from datetime import datetime

def msg_gpt(prompt):
    client = OpenAI()

    response = client.responses.create(
        model="gpt-5",
        instructions='You are a parser. Given the current date and time and a user prompt, extract the datetime being referred to and return only JSON in the format {"datetime": "<ISO8601 UTC string>"}.',
        input=prompt,
    )

    return response.output_text

FEATURE_COLS = [
    "lon","lat",
    "hour_sin","hour_cos",
    "dow_sin","dow_cos",
    "doy_sin","doy_cos",
    "mon_sin","mon_cos",
]

def add_time_features_one(dt_utc):
    hour  = dt_utc.hour
    dow   = dt_utc.dayofweek
    doy   = dt_utc.dayofyear
    month = dt_utc.month
    return {
        "hour_sin": np.sin(2*np.pi*hour/24.0),
        "hour_cos": np.cos(2*np.pi*hour/24.0),
        "dow_sin":  np.sin(2*np.pi*dow/7.0),
        "dow_cos":  np.cos(2*np.pi*dow/7.0),
        "doy_sin":  np.sin(2*np.pi*doy/366.0),
        "doy_cos":  np.cos(2*np.pi*doy/366.0),
        "mon_sin":  np.sin(2*np.pi*month/12.0),
        "mon_cos":  np.cos(2*np.pi*month/12.0),
    }

def predict_from_json(json_input,
                      model_path = "rain_model.pkl",
                      preproc_meta_path = "preproc.pkl"):
    
    if "datetime" not in json_input or "lon" not in json_input or "lat" not in json_input:
        raise ValueError("json_input must have keys: 'datetime', 'lon', 'lat'.")

    dt = pd.to_datetime(json_input["datetime"], utc=True, errors="raise")

    lon = float(json_input["lon"])
    lat = float(json_input["lat"])

    feats = {"lon": lon, "lat": lat}
    feats.update(add_time_features_one(dt))

    X = pd.DataFrame([[feats[col] for col in FEATURE_COLS]], columns=FEATURE_COLS).astype("float32")

    try:
        scaler = joblib.load(preproc_meta_path)  
        X[["lon","lat"]] = scaler.transform(X[["lon","lat"]])
    except FileNotFoundError:
        # Continue without scaling if you can not find the file of scaler model
        pass

    model = joblib.load(model_path)  
    proba = model.predict_proba(X)[:, 1][0]
    return float(proba)

if __name__ == "__main__":
    prompt = "a picnic on the next thursday"
    lat = 31
    lon = 31
    sample = json.loads(msg_gpt(prompt))
    sample["lat"] = lat
    sample["lon"] = lon
    print("Rain probability:", predict_from_json(sample))