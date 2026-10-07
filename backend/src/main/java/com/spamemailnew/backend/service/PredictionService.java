package com.spamemailnew.backend.service;

import com.spamemailnew.backend.model.Prediction;
import com.spamemailnew.backend.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;

    public PredictionService(PredictionRepository predictionRepository) {
        this.predictionRepository = predictionRepository;
    }

    public Prediction savePrediction(
            String emailText,
            String prediction,
            Double confidence) {

        Prediction result = new Prediction(
                emailText,
                prediction,
                confidence
        );

        return predictionRepository.save(result);
    }

    public List<Prediction> getAllPredictions() {
        return predictionRepository.findAll();
    }
}