# Lose Ideensammlung

## Die Situationsbeschreibung

> Wenn es zu einer Anwendungsentwicklung kommt, ist der Projektordner mit seinen Anwendungen für 4/5 des gesamten Projektteams eine "BlackBox". Und das kann sich sehr schnell zu einer "PandoraBox" entwickeln.

Eine "Gute Anwendung" zeichnet sich dadurch aus, ob sie den vom Auftraggeber gewünschten Mehrwert bietet und wenn alle Beteiligten flüssig arbeiten und Informationen austauschen können. Den ersten Teil sicherzustellen ist Aufgabe derer, die die Anwendung planen und konzipieren. Dafür gibt es POs und UI/UX-Designer. Der zweite Teil hingegen ist eine Gemeinschaftsaufgabe.

Als Entwickler ist es mein Job, ein System zu entwickeln, von dem ich zu jedem Zeitpunkt eine klare Aussage zum aktuellen Zustand jedem Projektbeteiligtem gegenüber treffen können muss. Das müssen FE, BE, Tester und DevOps gleichermassen tun.
Als PO/SM muss ich das eigentlich auch UND habe zusätzlich noch die Bringschuld gegenüber Kunden und Geschäftsführung, was den Kosten-Zeit-Faktor angeht.

> Ich habe hier Susanne, Tobias, Mark und Nelli als Projetleiter kennengelernt und jedesmal hatte ich den Eindruck, dass sie immer wieder hinter allem herrennen mussten, um Infos zum IST-Zustand zu sammeln.

Aus der Vogelperspektive sieht das dann aus wie kleine Inseln in einem Archipel, dass man "Projekt" nennt. Und wenn man scharf hinsieht, kann man die Projektleiter sehen, wie sie auf sehr kreative Weise versuchen, von Insel zu Insel zu kommen. Und wenn man Strömungen, Untiefen und Kauversuchen der Haie ausgewichen ist, weiß auf der Insel vielleicht niemand die Antwort, gesetzt den Fall, man findet das lichtscheue Gesindel überhaupt im Dickicht.

Das ist ja nicht nur bei uns so. Das kann ich versichern.

Um das Problem zu lösen, verabredete man im Allgemeinen Meetings mit sehr kreativen Namen wie bspw das "Brownbag-Meeting"[^brownbag], Workshops, Weiterbildungen, Entwicklerrunden und Projektvorstellungen um denen von den anderen Inseln, die eigene Lebensart und Sprache vorzustellen und um zu verhindern, das sich separate Lebensräume bilden. Das kann sehr viel Spaß machen und jeder wird mit dem Gefühl der Bereicherung wieder nach Hause schippern... und morgen ist das alles wieder vergessen, weil der eigene Inselalltag wartet. Und wenn man dann zu Firmenevents auf der Hauptinsel zusammenkommt, kann man sich den Sonnenuntergang ja immer noch schöntrinken.

Bei aller Südsseromantik und dem Wunsch nach dem Ursprünglichem: Lasst uns umziehen. Vom Archipel in einen eigenen Stadtteil. Lasst die Inselbewohner ihre eigenen Distrikte aufbauen, die jeder jederzeit besuchen kann. Und das möglichst ohne Karte in fremder Sprache, die mit Runen versehen ist, die nur bei Vollmond von einem Elben oder Zauberer gelesen werden kann.

Wie dieser Distrikt aussieht, beschreibe ich gleich, vorher will bzw muss ich aber kurz erläutern, wie es dazu gekommen ist. Denn es war nicht der Plan, ein Development System zu entwerfen. Das war eher das Abfallprodukt. Aber wie mein Kunstlehrer zu sagen pflegte: "Manchmal kann man daraus noch was machen."

Wie manchen bekannt sein sollte, haben wir seit Juni eine schwierigere Situation und einige befinden sich in der Weiterbildung. Mein "Auftrag" dabei war, sich in TYPO3 einzuarbeiten. Dann aber auch in Angular und dann wollte jemand wissen, ob man TYPO3 nicht headless betreiben, und mit Angular und WebComponents darstellen könnte. Ich fand die Frage merkwürdig, denn die Antwort ist: "Ja, klar!". Um das zu zeigen, setzte ich TYPO3 auf, ein Angular Projekt und entschied mich für Stencil zum Bauen der WebComponents.

> Nur zur Info: Wenn man mit Stencil entwickelt, gibt es localhost-Adresse mit dem Javascript. Für den Build braucht es eine andere Lösung.

Also habe ich die WebComponents-Url in mein Angular als externe Resource eingebunden, einige Beispielseiten in TYPO3 mit Inhalten befüllt und die Adressen als Service in Angular implementiert. Und ja, geht. Dann stellte sich die Frage, wie deploye ich das eigentlich? Wie gehe ich mit Änderungen in den WebComponents um? Was müssen die CD-Pipelines machen, damit ein derartiges Konstrukt auch Live gehen kann? Wie koordiniere ich die Arbeiten an den Bestandteilen? Und ... wie erkläre ich das den Kollegen? Was müssen denn Scrummaster und der PO darüber wissen, um eine halbwegs zeitgenaue Planung zu erreichen? Klar, man kann das alles irgendwie dokumentieren und in irgendwelchen Wikis festhalten. Schon schreibe ich nur noch Dokus und überall liegt der Duden rum. Und das muss dann auch noch wer lesen wollen und vor allem verstehen können. Das ist Quälerei. Für alle. 

> Deswegen ist der Beruf des "Technischen Redakteurs" ein Akademischer. Deswegen sind die meisten Rufe nach ausufernder Dokumentation auch oft das Problem anstatt Teil der Lösung. Wie sagte der britische Autor Douglas Adams? "Woran erkennt man unzureichend gut entwickelte Technik? - Wenn ein Handbuch dabei liegt."

Und so stellte sich heraus, das die Frage eigentlich lauten sollte: "Wie würde man mit einer derartigen Architektur aus Headless-CMS + DB, MVVM-Framework und Component-Framework entwickeln?". Auch die Antwort war schnell gefunden: "Unter großen Schwierigkeiten!" - Die Anwort gefiel mir nicht -. 

Ohne jetzt weiter ins Detail gehen zu wollen, man muss eine Menge Abhängigkeiten schaffen, die sofort genau diesen Doku-Aufwand nach sich ziehen. Das ist bestimmt einmal möglich. Aber dann kennen sich auch nur wieder die damit aus, die sich das Konstrukt damals ausgedacht haben, was auch immer wieder zu Störungen im Arbeitsfluss führt. Ja, es heißt "WorkFLOW" und nicht "WorkStopAndGo". 

Und dann ändert sich auf einmal der TechStack und ich steh im "WorkSTAU". 

Schätze, wir können uns darauf einigen, dass niemand Interesse daran hat, im Stau zu stehen oder im Stop-Motion-Rythmus zu arbeiten. Es hat aber auch keiner Interesse daran, auf bestimmte Wege und Arbeitsweisen gezwungen zu werden oder ein hartes Dogma durchzusetzen. Das klappt nämlich nicht. Dazu müssten alle eingesetzten Systeme auf denen das aufbaut, sich niemals ändern. Und das Umfeld auch nicht. Auch hat niemand Bock, ständig hinter irgendwas oder irgendwem herrennen zu wollen auch nicht das Gefühl haben wollen, etwas oder jemand wäre hinter einem her.

Ich bin Webentwickler geworden, um mit den Werkzeugen des Internets Lösungen zu finden, Projekte und Projektideen umzusetzen. Und das ist ein kreativer Prozess. Und in einem kreativen Prozess stellt man Fragen an sein Werk.

Um jetzt die eigentliche Frage beantworten zu können, stellte ich also die Fragen: "Wie will *ich* damit arbeiten und wie kann ich alle aufkommenden Fragen diesbzüglich beantworten, wenn sie gestellt werden?"

Was dann folgte, war eine längere Abfolge aufgesetzter Systeme und Konstellationen und wie man sie zusammen spielen lassen muss, um das zu beantworten.

Keine Angst, ich gehe das nicht durch. Könnte ich auch nicht, davon ist Vieles defenstriert.

Aber ich zeige jetzt das Ergebnis.

Also gleich.

Alle an der Produktion digitaler Projekte beteiligten Personen müssen sich mit 5 verschiedenen Systemen auskennen

* Frontend-Systeme
* Backend- oder Api-Systeme
* Datenbanksysteme
* Hostingsysteme
* Betriebssysteme

*Wobei Hostingssysteme auch immer Betriebssysteme sind. Und alles andere auf ihnen läuft.*

Abhängig von Position und Rolle im Projekt ist mal mehr mal weniger Know-How erforderlich. Projektleiter brauchen nicht den letzten geilen Scheiss aus der Datenbankwelt zu wissen. Dafür rennt irgendwo wer rum, den man fragen kann. 

Ich fasse zusammen: Gesucht wird also ein Entwicklungssystem, das von Personen eingesehen und entwickelt wird, die wichtige Rollen bekleiden, Entscheidungen treffen und die Zukunft des Projekts gestalten, die aber komplett unterschiedliche Sprachen sprechen, unterschiedlich motiviert sind und unterschiedliches Handwerk erlernt haben, das nichts miteinander zu hat. Und das in einer Welt, die sich in kürzester Zeit signifikant ändern kann.

Das klingt ja einfach.

> Ich betone das hier nur, um klar zu stellen, dass ich hier keinen cleveren Code zu dem Heiligen Gral vorstelle, um Entwickler zu beeindrucken, sondern eine Projektstruktur, die es uns ermöglicht, diese heterogene Gesellschaft ihre Stärken ausleben zu lassen.





---
## schnipsel

> Die wichtigste Waffe bei der Entwicklung ist die **Überzeugung**!

Es wäre vermessen zu behaupten, ich wüsste, wie Webanwendungen am Besten gebaut werden, wie jemand beim Entwickeln vorgehen sollte oder was die beste Methode oder das beste Framework ist. Wie könnte ich auch? Aber beantworten kann ich die Frage trotzdem: "Die beste Methode, das beste Framework und die beste Vorgehensweise ist die, mit dem das Projekteam am besten klarkommt!".












---

[^brownbag]: Früher haben Angestellte ihr Mittagessen in braunen Papiertüten rumgetragen. Dises Meeting sollte in der Küche stattfinden, wo jemand etwas präsentiert, während der Rest sein Mittag verputzt. Man kann da bestimmt drüber streiten, aber ich finde das grotesk.
