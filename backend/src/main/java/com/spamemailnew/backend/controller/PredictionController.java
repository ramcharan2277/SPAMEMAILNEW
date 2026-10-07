package com.spamemailnew.backend.controller;

import com.spamemailnew.backend.model.*;
import com.spamemailnew.backend.service.NaiveBayesClassifier;
import com.spamemailnew.backend.service.PredictionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PredictionController {

    private final NaiveBayesClassifier c;
    private final PredictionService predictionService;

    public PredictionController(
            NaiveBayesClassifier c,
            PredictionService predictionService) {

        this.c = c;
        this.predictionService = predictionService;
    }

    @GetMapping("/health")
    public String health() {
        return "Spam Email Classifier API is running";
    }

    @PostMapping("/predict")
    public ResponseEntity<PredictionResponse> predict(
            @RequestBody PredictionRequest r) {

        // Validate request
        if (r == null || r.text() == null || r.text().isBlank()) {

            return ResponseEntity.badRequest().body(
                    new PredictionResponse(
                            "UNKNOWN",
                            0,
                            0,
                            "Please enter an email message."
                    )
            );
        }

        // Run Naive Bayes prediction
        var x = c.predict(r.text());

        // Calculate confidence
        double confidence;

        if (x.label().equals("SPAM")) {
            confidence = x.spamProbability();
        } else {
            confidence = x.hamProbability();
        }

        // Save prediction to MySQL
        predictionService.savePrediction(
                r.text(),
                x.label(),
                confidence
        );

        // Return response to frontend
        return ResponseEntity.ok(
                new PredictionResponse(
                        x.label(),
                        x.spamProbability(),
                        x.hamProbability(),
                        x.label().equals("SPAM")
                                ? "This message looks suspicious."
                                : "This message looks like a normal email."
                )
        );
    }

    // Get all prediction history
    @GetMapping("/predictions")
    public ResponseEntity<List<Prediction>> getAllPredictions() {

        return ResponseEntity.ok(
                predictionService.getAllPredictions()
        );
    }
}