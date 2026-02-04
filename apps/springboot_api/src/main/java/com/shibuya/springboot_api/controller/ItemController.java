package com.shibuya.springboot_api.controller;

import com.shibuya.springboot_api.model.Item;
import com.shibuya.springboot_api.repository.ItemRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Entspricht deinem CorsLayer::permissive()
public class ItemController {

  private final ItemRepository itemRepository;

  // Route: GET /api/status
  @GetMapping("/status")
  public Map<String, String> getStatus() {
    return Map.of(
      "status",
      "online",
      "message",
      "SHIBUYA Spring Boot Backend ist bereit",
      "database",
      "verbunden"
    );
  }

  // Route: GET /api/items (Geschützt)
  @GetMapping("/items")
  public List<Item> getMyItems(@AuthenticationPrincipal Jwt jwt) {
    // 'sub' extrahieren (wie in Rust claims.sub)
    String sub = jwt.getClaimAsString("sub");
    System.out.println(
      "🔑 SHIBUYA Auth: User " + sub + " möchte seine Items abholen"
    );

    return itemRepository.findByOwnerId(UUID.fromString(sub));
  }
}
