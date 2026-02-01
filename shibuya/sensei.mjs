// shibuya/tools/sensei.mjs

const principles = [
  "Individuen und Interaktionen mehr als Prozesse und Werkzeuge",
  "Funktionierende Software mehr als umfassende Dokumentation",
  "Zusammenarbeit mit dem Kunden mehr als Vertragsverhandlung",
  "Reagieren auf Veränderung mehr als das Befolgen eines Plans",
  "Unsere höchste Priorität ist es, den Kunden durch frühe und kontinuierliche Auslieferung wertvoller Software zufrieden zu stellen.",
  "Heisse Anforderungsänderungen selbst spät in der Entwicklung willkommen. Agile Prozesse nutzen Veränderungen zum Wettbewerbsvorteil des Kunden.",
  "Liefere funktionierende Software regelmäßig innerhalb weniger Wochen oder Monate und bevorzuge dabei die kürzere Zeitspanne.",
  "Fachexperten und Entwickler müssen während des Projektes täglich zusammenarbeiten.",
  "Errichte Projekte rund um motivierte Individuen. Gib ihnen das Umfeld und die Unterstützung, die sie benötigen und vertraue darauf, dass sie die Aufgabe erledigen.",
  "Die effizienteste und effektivste Methode, Informationen an und innerhalb eines Entwicklungsteams zu übermitteln, ist im Gespräch von Angesicht zu Angesicht.",
  "Funktionierende Software ist das wichtigste Fortschrittsmaß.",
  "Agile Prozesse fördern nachhaltige Entwicklung. Die Auftraggeber, Entwickler und Benutzer sollten ein gleichmäßiges Tempo auf unbegrenzte Zeit halten können.",
  "Ständiges Augenmerk auf technische Exzellenz und gutes Design fördert Agilität.",
  "Einfachheit -- die Kunst, die Menge nicht getaner Arbeit zu maximieren -- ist essenziell.",
  "Die besten Architekturen, Anforderungen und Entwürfe entstehen durch selbstorganisierte Teams.",
  "In regelmäßigen Abständen reflektiert das Team, wie es effektiver werden kann und passt sein Verhalten entsprechend an.",
];

function wrapText(text, limit) {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length > limit) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  });
  lines.push(currentLine.trim());
  return lines;
}

// shibuya/tools/sensei.mjs

function drawBox(text) {
  const boxWidth = 40; // Etwas breiter für bessere Lesbarkeit
  const contentWidth = boxWidth - 6; // Platz für "│  " und "  │"
  const lines = wrapText(text, contentWidth);

  const top = `╭${"─".repeat(boxWidth - 2)}╮`;
  const bottom = `╰${"─".repeat(boxWidth - 2)}╯`;

  console.log(`\x1b[36m`); // SHIBUYA-Cyan
  console.log(top);

  lines.forEach((line) => {
    // Exakte Berechnung des Paddings:
    // Wir füllen den Rest der Zeile bis zur contentWidth exakt mit Leerzeichen auf
    const paddingCount = Math.max(0, contentWidth - line.length);
    const padding = " ".repeat(paddingCount);
    console.log(`│  ${line}${padding}  │`);
  });

  console.log(bottom);
  console.log(`\x1b[0m`);
}

const randomPrinciple =
  principles[Math.floor(Math.random() * principles.length)];
drawBox(randomPrinciple);
