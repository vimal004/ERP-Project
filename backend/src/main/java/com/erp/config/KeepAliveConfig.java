package com.erp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Keep-Alive Configuration for Render Free Tier.
 *
 * Render free tier spins down after 15 minutes of inactivity.
 * This pings the health endpoint every 13 minutes to prevent that.
 *
 * Only active in the 'prod' profile.
 */
@Configuration
@EnableScheduling
@Profile("prod")
public class KeepAliveConfig {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveConfig.class);

    @Value("${app.keep-alive.url:#{null}}")
    private String keepAliveUrl;

    @Value("${server.port:8080}")
    private int serverPort;

    /**
     * Self-ping every 13 minutes (780000 ms).
     * Render timeout is 15 min, so 13 gives safe margin.
     * Initial delay of 60s to let the app fully boot.
     */
    @Scheduled(fixedDelay = 780000, initialDelay = 60000)
    public void keepAlive() {
        String url = (keepAliveUrl != null && !keepAliveUrl.isBlank())
                ? keepAliveUrl
                : "http://localhost:" + serverPort + "/actuator/health";

        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            int responseCode = connection.getResponseCode();

            if (responseCode == 200) {
                logger.info("Keep-alive ping OK ({})", responseCode);
            } else {
                logger.warn("Keep-alive ping returned: {}", responseCode);
            }

            connection.disconnect();
        } catch (Exception e) {
            logger.warn("Keep-alive ping failed: {}", e.getMessage());
        }
    }
}
