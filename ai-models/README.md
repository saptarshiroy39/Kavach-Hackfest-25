# AI Models

This directory contains AI models and related code for the Project Hackfest 25 application.

## Overview

The AI components in this project are responsible for:
- Threat detection and analysis
- Anomaly detection in security events
- Predictive security analytics

## Model Files

- `threat_detection.py`: Implements machine learning models for detecting security threats
- `anomaly_detection.py`: Implements anomaly detection algorithms for identifying unusual patterns
- `model_training.py`: Contains code for training and updating the AI models

## Integration

The AI models integrate with the backend through the AI service defined in `backend/services/ai.js`.

## Requirements

- Python 3.8+
- TensorFlow 2.x
- scikit-learn
- pandas
- numpy

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Download pre-trained models (if applicable) from the project repository.

3. Run the model server:
   ```
   python model_server.py
   ```

## Model Performance

Performance metrics and evaluation results will be documented here as models are developed and tested.
