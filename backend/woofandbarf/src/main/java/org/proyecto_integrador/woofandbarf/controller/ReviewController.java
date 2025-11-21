package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.ProductNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.ReviewNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Review;
import org.proyecto_integrador.woofandbarf.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{idProduct}")
    public ResponseEntity<List<Review>> getByProduct(@PathVariable Long idProduct) {
        try {
            return ResponseEntity.ok(reviewService.getByProduct(idProduct));
        } catch (ProductNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/product/{idProduct}")
    public ResponseEntity<?> create(@PathVariable Long idProduct, @RequestBody Review review) {
        try {
            Review saved = reviewService.create(idProduct, review);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{idReview}")
    public ResponseEntity<Void> delete(@PathVariable Long idReview) {
        try {
            reviewService.delete(idReview);
            return ResponseEntity.noContent().build();
        } catch (ReviewNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

