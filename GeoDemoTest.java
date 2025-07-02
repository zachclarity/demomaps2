package com.example.demo.utils;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class GeoUtilsTest {

    @Test
    void testFindPointsInCircle_validPoints() {
        // Arrange
        GeoUtils.Point[] points = new GeoUtils.Point[] {
            new GeoUtils.Point(0.0, 0.0),    // Within 100km
            new GeoUtils.Point(1.0, 1.0),    // ~111km away, outside
            new GeoUtils.Point(0.1, 0.1)     // ~11km away, within
        };
        double centerLon = 0.0;
        double centerLat = 0.0;
        double radius = 100000; // 100km in meters
        GeoUtils.GeoOptions options = new GeoUtils.GeoOptions(6371000);

        // Act
        List<GeoUtils.Point> result = GeoUtils.findPointsInCircle(points, centerLon, centerLat, radius, options);

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).extracting("lon").containsExactlyInAnyOrder(0.0, 0.1);
        assertThat(result).extracting("lat").containsExactlyInAnyOrder(0.0, 0.1);
    }

    @Test
    void testFindPointsInCircle_noPointsWithinRadius() {
        // Arrange
        GeoUtils.Point[] points = new GeoUtils.Point[] {
            new GeoUtils.Point(2.0, 2.0),    // ~222km away
            new GeoUtils.Point(3.0, 3.0)     // ~333km away
        };
        double centerLon = 0.0;
        double centerLat = 0.0;
        double radius = 10000; // 10km in meters
        GeoUtils.GeoOptions options = new GeoUtils.GeoOptions(6371000);

        // Act
        List<GeoUtils.Point> result = GeoUtils.findPointsInCircle(points, centerLon, centerLat, radius, options);

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    void testFindPointsInCircle_nullPointsArray() {
        // Arrange
        GeoUtils.Point[] points = null;
        double centerLon = 0.0;
        double centerLat = 0.0;
        double radius = 100000;
        GeoUtils.GeoOptions options = new GeoUtils.GeoOptions(6371000);

        // Act
        List<GeoUtils.Point> result = GeoUtils.findPointsInCircle(points, centerLon, centerLat, radius, options);

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    void testFindPointsInCircle_nullPointInArray() {
        // Arrange
        GeoUtils.Point[] points = new GeoUtils.Point[] {
            new GeoUtils.Point(0.0, 0.0),
            null,
            new GeoUtils.Point(0.1, 0.1)
        };
        double centerLon = 0.0;
        double centerLat = 0.0;
        double radius = 100000;
        GeoUtils.GeoOptions options = new GeoUtils.GeoOptions(6371000);

        // Act
        List<GeoUtils.Point> result = GeoUtils.findPointsInCircle(points, centerLon, centerLat, radius, options);

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).extracting("lon").containsExactlyInAnyOrder(0.0, 0.1);
        assertThat(result).extracting("lat").containsExactlyInAnyOrder(0.0, 0.1);
    }

    @Test
    void testFindPointsInCircle_customEarthRadius() {
        // Arrange
        GeoUtils.Point[] points = new GeoUtils.Point[] {
            new GeoUtils.Point(0.0, 0.0),
            new GeoUtils.Point(1.0, 1.0) // ~111km with standard Earth radius
        };
        double centerLon = 0.0;
        double centerLat = 0.0;
        double radius = 120000; // 120km
        GeoUtils.GeoOptions options = new GeoUtils.GeoOptions(6378137); // WGS84 radius

        // Act
        List<GeoUtils.Point> result = GeoUtils.findPointsInCircle(points, centerLon, centerLat, radius, options);

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).extracting("lon").containsExactlyInAnyOrder(0.0, 1.0);
        assertThat(result).extracting("lat").containsExactlyInAnyOrder(0.0, 1.0);
    }

    @Test
    void testFindPointsInCircle_zeroRadius() {
        // Arrange
        GeoUtils.Point[] points = new GeoUtils.Point[] {
            new GeoUtils.Point(0.0, 0.0),
            new GeoUtils.Point(0.1, 0.1)
        };
        double centerLon = 0.0;
        double centerLat = 0.0;
        double radius = 0.0;
        GeoUtils.GeoOptions options = new GeoUtils.GeoOptions(6371000);

        // Act
        List<GeoUtils.Point> result = GeoUtils.findPointsInCircle(points, centerLon, centerLat, radius, options);

        // Assert
        assertThat(result).isEmpty();
    }
}
