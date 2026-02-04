package com.shibuya.springboot_api.repository;

import com.shibuya.springboot_api.model.Item;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {
  // Spring generiert das SQL automatisch anhand des Methodennamens!
  List<Item> findByOwnerId(UUID ownerId);
}
