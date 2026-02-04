package com.shibuya.springboot_api.model;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.Data;

@Entity
@Table(name = "items")
@Data // Generiert Getter, Setter, toString via Lombok
public class Item {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String description;

  @Column(name = "owner_id", nullable = false) // Füge nullable = false hinzu
  private UUID ownerId;

  @Column(nullable = false)
  private String title;
}
