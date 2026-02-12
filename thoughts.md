# Lose Ideensammlung

## Die Situationsbeschreibung

> Wenn es zu einer Anwendungsentwicklung kommt, ist der Repoordner mit seinen Anwendungen für den Großteil des gesamten Projektteams eine "BlackBox". Und das kann sich sehr schnell zu einer "PandoraBox" entwickeln, in der kleine Zeitfresser die

Eine "Gute Anwendung" zeichnet sich dadurch aus, dass sie den vom Auftraggeber gewünschten Mehrwert bietet und wenn alle Beteiligten flüssig arbeiten und Informationen austauschen können. Den ersten Teil sicherzustellen ist Aufgabe derer, die die Anwendung planen und konzipieren. Dafür gibt es POs und UI/UX-Designer. Der zweite Teil hingegen ist eine Gemeinschaftsaufgabe.

Als Entwickler ist es mein Job, ein System zu entwickeln, von dem ich zu jedem Zeitpunkt eine klare Aussage zum aktuellen Zustand jedem Projektbeteiligtem gegenüber treffen können muss. Das müssen FE, BE, Tester und DevOps gleichermassen tun.
Als PO/SM muss ich das eigentlich auch UND habe zusätzlich noch die Bringschuld gegenüber Kunden und Geschäftsführung, was den Kosten-Zeit-Faktor angeht.

> Ich habe hier Susanne, Tobias, Mark und Nelli als Projetleiter kennengelernt und jedesmal hatte ich den Eindruck, dass sie immer wieder hinter allem herrennen mussten, um Infos zum IST-Zustand zu sammeln. Das ist dann eher der Job eines Pressesprechers: Man ist an keiner Entscheidung beteiligt, muss sie aber vertreten. Nicht schön.

Aus der Vogelperspektive sieht das dann aus wie kleine Inseln in einem Archipel, dass man "Projekt" nennt. Und wenn man scharf hinsieht, kann man die Projektleiter sehen, wie sie auf sehr kreative Weise versuchen, von Insel zu Insel zu kommen. Und wenn sie Strömungen, Untiefen und den Kauversuchen der Haie ausgewichen sind, weiß auf der Insel vielleicht niemand die Antwort, gesetzt den Fall, man findet das lichtscheue Gesindel überhaupt im Dickicht.

> Das ist nicht nur bei uns so. Das kann ich versichern.

Um das Problem zu lösen, verabredeten manche Meetings mit sehr kreativen Namen wie bspw das "Brownbag-Meeting"[^brownbag]. Oder Workshops, Weiterbildungen, Entwicklerrunden und Projektvorstellungen um den anderen Inselbewohnern die eigene Lebensart, Sprache und Kultur vorzustellen. Das schafft nen frischen Genpool und es verhindert isolierte Lebensräume.

Das macht viel Spaß und jeder wird mit dem Gefühl der Bereicherung wieder nach Hause schippern... und morgen ist das alles wieder wie immer, weil der eigene Inselalltag wartet.

Bei aller Südsseromantik und dem Wunsch nach dem Ursprünglichem: Lasst uns umziehen. Vom Archipel in einen modernen Stadtteil mit fließend Wasser. Lasst die Inselbewohner ihre eigenen Distrikte beziehen, die jeder jederzeit besuchen kann. Vorzugsweise ohne eine Karte mit Mondrunen, die nur von Elben gelesenen werden kann.

## Die Ausgangssituation

Wie dieser Distrikt aussieht, beschreibe ich gleich, vorher muss ich kurz erläutern, wie es dazu gekommen ist. Denn es war nicht der Plan, dieses Development System zu entwerfen. Das ist das Abfallprodukt. Aber wie mein Kunstlehrer zu sagen pflegte: "Manchmal kann man daraus noch was machen."

Einige befinden sich in der Weiterbildung. Mein "Auftrag" dabei war, sich in TYPO3 einzuarbeiten. Dann aber auch in Angular und dann wollte jemand wissen, ob man TYPO3 nicht headless betreiben, und mit Angular und WebComponents darstellen könnte. Ich fand die Frage merkwürdig, denn die Antwort ist natürlich: "Ja, klar!". Um das zu zeigen, setzte ich TYPO3 auf, ein Angular Projekt und entschied mich für Stencil zum Bauen der WebComponents.

> Nur zur Info: Wenn man mit Stencil entwickelt, gibt es localhost-Adresse mit dem Javascript. Für den Build braucht es eine andere Lösung.

Also habe ich die WebComponents-Url in mein Angular als externe Resource eingebunden, einige Beispielseiten in TYPO3 mit Inhalten befüllt und die Adressen als Service in Angular implementiert. Und ja, geht. So kann man entwickeln.

Aber das ist ja nicht die ganze Geschichte. Dazu gehört noch sehr viel mehr.

Es stellte sich die Frage, wie deploye ich das eigentlich? Und dann gleich hinterher: Wie gehe ich mit Änderungen in den WebComponents um? Was müssen die CD-Pipelines machen, damit ein derartiges Konstrukt auch Live gehen kann? Wie koordiniere ich die Arbeiten an den Bestandteilen? Und ... wie erkläre ich das den Kollegen und was müssen denn Scrummaster und der PO darüber wissen, um eine halbwegs zeitgenaue Planung zu erreichen? 

Klar, man kann das alles irgendwie dokumentieren und in irgendwelchen Wikis festhalten. Schon schreibe ich nur noch Dokus und überall liegen Duden und Rechtschreibbücher rum. Und das muss dann auch noch wer finden, lesen wollen und vor allem verstehen können. Das ist Quälerei. Für alle. 

> Der Beruf des "Technischen Redakteurs" ist nicht grundlos ein Akademischer. Und das sind wir nicht. Deswegen sind die meisten Rufe nach ausufernder Dokumentation mit Diagrammen und Berechnungen oft Teil des Problems anstatt Teil der Lösung. Wie sagte der britische Autor Douglas Adams? "Woran erkennt man unzureichend gut entwickelte Technik? - Wenn ein Handbuch dabei liegt.". Nebenbei gesagt, haben diese Handbücher auch den Charakter der Vorlage für den oben erwähnten Pressesprecher.

Und so stellte sich heraus, das die Frage eigentlich hätte lauten sollen: "Wie würde man mit einer derartigen Architektur aus Headless-CMS + DB, MVVM-Framework und Component-Framework produzieren?". Die Antwort war schnell gefunden: "Unter großen Schwierigkeiten!" - Und das ist keine befriedigende Antwort. 

Ohne jetzt weiter ins Detail gehen zu wollen, man muss eine Menge Abhängigkeiten schaffen, die sofort genau diesen Doku-Aufwand nach sich ziehen. Das ist bestimmt mal möglich. Aber dann kennen sich auch nur wieder die damit aus, die sich das Konstrukt damals ausgedacht haben und die Doku lesen können (wenn sie überhaupt geschrieben wurde), was immer zu Störungen im Arbeitsfluss derer führt, die Resourcen und Verfügbarkeiten im Unternehmen dirigieren und delegieren müssen. Denn gerade für die ist eine eindeutige Aussage zum Zustand des Projektes von essentieller Natur.

> Und wir wollen einen "WorkFLOW" und nicht "WorkStopAndGo". 

Tja, und dann ändert sich auf einmal der TechStack oder das Team und ich steh im "WorkSTAU". Sackgasse. Ende. Jetzt braucht es die Eloquenz der Geschäftsführer, die die Kuh jetzt irgendwie vom Eis schubsen müssen und das mit Zugeständnissen, die die Weiterarbeit nicht zwingend angenehmer machen und noch seltener im Sinne der Entwickelnden sind.

Schätze, wir können uns darauf einigen, dass daran niemand Interesse hat.  

Es hat aber *auch* keiner Interesse daran, auf bestimmte Wege und Arbeitsweisen gezwungen zu werden oder ein hartes Dogma durchzusetzen. Das klappt nämlich nicht. Dazu müssten alle eingesetzten Systeme auf denen das aufbaut, sich niemals ändern. Und das Umfeld ebenfalls nicht. Unrealistisch.   
Auch hat niemand Bock, ständig hinter irgendwas oder irgendwem herrennen zu müssen auch nicht das Gefühl haben wollen, etwas oder jemand wäre hinter einem her.

## Die Ich-Situation

Ich bin Webentwickler geworden, um mit den Werkzeugen des Internets Lösungen zu finden, um Projekte und Projektideen umzusetzen und zu realisieren.  

Das ist ein kreativer Prozess.  
Und in einem kreativen Prozess stellt man Fragen.

Um jetzt die eigentliche Frage beantworten zu können, stellte ich also Fragen: "Wie will *ich* damit arbeiten und wie kann ich alle aufkommenden Fragen diesbzüglich beantworten, wenn sie gestellt werden?"

Was dann folgte, war eine längere Abfolge aufgesetzter Systeme und Konstellationen und wie man sie zusammen spielen lassen muss, um das zu beantworten. Und jedesmal stellte ich die gleichen Fragen an den Code.

Keine Angst, ich gehe das nicht durch. Könnte ich auch nicht, davon ist Vieles defenstriert. Aber das war ein ziemlich guter Chrashkurs durch die GettingStarted-Kapitel vieler verschiedener Frameworks und wie man sie konfigurieren muss. Kann ich nur empfehlen.

Ich zeige das Ergebnis meiner Exkursionen. Also gleich.

Nachdem ich mich dann also aus der EgoShooter-Perspektive Richtung ThirdPersonShooter bewege, veränderte sich die Fragestellung: "Was muss ich tun bzw gewährleisten, damit jmd anderes sofort seine nächsten Schritte darauf aufbauen kann?" - "Ich muss meinen Blickwinkel ändern."

## Die Wir-Situation

Alle an der Produktion digitaler Projekte beteiligten Personen *müssen* sich mit 5 verschiedenen Systemen auskennen

* Frontend-Systeme
* Backend- oder Api-Systeme
* Datenbanksysteme
* Hostingsysteme
* Betriebssysteme

*Wobei Hostingssysteme auch immer Betriebssysteme sind.*

Abhängig von Position und Rolle im Projekt ist mal mehr mal weniger Know-How erforderlich. Projektleiter brauchen nicht den letzten geilen Scheiss aus der Datenbankwelt zu wissen. Dafür rennt irgendwo wer rum, den das interessiert oder interessieren muss. 

**Ich fasse kurz zusammen**: Gesucht wird also eine Entwicklungsstruktur, die von Personen eingesehen und entwickelt wird, die wichtige Rollen bekleiden, Entscheidungen treffen und die Zukunft des Projekts gestalten, die aber komplett unterschiedliche Sprachen sprechen, unterschiedlich motiviert sind und unterschiedliches Handwerk erlernt haben. Und das in einer Welt, die sich in kürzester Zeit signifikant ändern kann.

Das klingt ja einfach.

> Ich betone das hier nur, um klar zu stellen, dass ich hier keinen cleveren Code vorstelle, um zu beeindrucken, sondern eine Projektstruktur, die es ermöglicht, die **Stärken einer solch heterogenen Umgebung zu nutzen**. Dazu muss ich alle versammeln.

Was habe ich also für Möglichkeiten, damit alle in das Projekt während der Produktion einsehen und daraus eine eindeutige Aussage zum Status des Produktes treffen können?

## Die Versionskontrolle = Teil der Lösung

Alles andere ist ein Kompromiss oder ein Ausweichen, aber auf jeden Fall mit Zusatzarbeiten behaftet.

> Ich fand das schon bei PrIMA merkwürdig, dass ausser den FE-/BE-Entwicklern, niemand in das Repo geschaut hat und nicht die Möglichkeiten von BitBucket ausgeschöpft wurden. Stattdessen wurde auf andere Portale ausgewichen und separate Dokumentationen und verteilte Dokumente gepflegt. Aber nicht regelmässig. Und schon garnicht dafür ausgelegt, dass man damit hätte arbeiten können.

Versionskontrollen wie Git können unfassbar viel. Das Ding ist darauf ausgelegt, weltweite Kernelentwicklung für eine absolut heterogene Welt von Distributionen auf allen existierenden Geräten und in Potenzia zu koordinieren. Und das verlässlich.

"Kann ich also in einem IT-Unternehmen erwarten, dass alle, die mit der Produktion digitaler Produkte direkt betraut sind, sich mit den Grundzügen der Versionskontrolle auskennen?" 

Ich meine, ja. Auf jeden Fall. Denn das eröffnet atemberaubende Möglichkeiten. Schon aus ganz egoistischen Gründen. Ich will *meinen* Tag planen und nicht *meinen* Ablauf nach den Tagesplänen anderer ausrichten. Ich will auch nicht, dass das jemand anderes tut.

> Keine Angst, ich will hier kein Expertenwissen erforderlich machen und es muss sich auch niemand unter Druck gesetzt fühlen.

Niemand käme auf die Idee, das Tobias oder Axel beim Auflösen von Mergekonflikten helfen sollten, oder eine geschickte Branchstrategie vorgeben. Genausowenig würde ich von den Vertrieblern erwarten, dass sie Pull-Requests stellen. Aber von den Anwendungsentwicklern kann und muss ich das. Ich vertraue darauf, dass jeder seine Aufgabe erfüllen will.

Was wäre denn eine realistische Erwartungshaltung an alle Projektbeteiligten? Das ist eine intressante Debatte, die wir an anderer Stelle diskutieren sollten. Das war im Selbstgespräch schon spannend. Ich habe hinterher nicht mehr mit mir gesprochen, weil rauskam, dass ich selbst auch einen höheren Anspruch an mich selbst hätte stellen müssen.

Zeit ist wertvoll. Meine Zeit ist wertvoll und damit auch automatisch: Deine. Daraus ergibt sich eine klare Konsequenz: "Ich arbeite so, dass andere darauf aufbauen können!" oder wie es meine Chefin bei AB@Media ausdrückte: "Gehe sorgfältig mit der Zeit deines Gegenübers um.". Das findet sich auch in den Prinzipien des Agilen Manifests. Und wer es philosophischer möchte: Auch bei Kant.

Das Entwicklungssystem, dass ich jetzt wirklich gleich vorstellen werde, nimmt darauf Rücksicht. Es ist so ausgelegt, dass man mit den einfachsten Befehlen das Projekt und dessen Status einsehen und sogar mitgestalten kann, ohne sich zusätzlich in was Neues einarbeiten zu müssen. Und mit etwas Übung beim "Lesen" eines Repos kann man schon an der History sehen, was abgeht.

Ja, für einige ist das Arbeiten mit Versionskontrollen eine Hürde. Aber die ist flach und gepolstert. Ich behaupte, dass ich jedem hier im Raum innerhalb einer Stunde alles Notwendige zu einem Repo zeigen und beibringen kann. Und nein, man kann keinen irreversiblen Schaden anrichten. Das müsste man wollen und die Repoberechtigungen dazu haben.

Und das ist auch schon alles. Mehr braucht es nicht, um Srummastern, Projektleitern und anderen direkt und indirekt Beteiligten Zugang zum IST-Zustand zu ermöglichen. (Vorbei die Haiangriffe und die Suche im Dickicht)

* git clone, pull, commit, push - Das ist alles. Wenn Pull nicht sogar in den meisten Fällen ausreicht.

Und das muss nichtmal sofort auf einmal erlernt werden. Das kann man nach und nach. Und wenn es nicht geht, kann das Team immer noch Ausweichmöglichkeiten vereinbaren.

Im System sind Bereiche nur für die Dokumentation des Projektablaufs angelegt, die automatich genau das leisten können, was vorher von Menschen aktiv manuell auf unterschiedlichen Plattformen ausgeführt werden musste.

Und bei aller Scheu vor der Kommandozeile oder dem Linux Subsystem. Es lohnt sich, diese zu verlieren. Und das ist kein langer Prozess. Eine Stunde, 10-20 Wiederholungen der wichtigsten Workflows und schon hat das jeder drauf. Das ist gut investierte Zeit. Und jeder Entwickler kann jederzeit helfen.

> One Workshop to rule them all!

Ich wollte das Entwicklungssystem zeigen, richtig? - Gleich. Vorher will ich noch auf einen Nebeneffekt eingehen.

Ich habe lange Zeit als Türsteher und Veranstaltungsschützer gearbeitet. Die wirkungsvollste Waffe ist die **Überzeugung**. Nur sie bringt aufgebrachte Menschen dazu, ihre Handlungen zu überdenken. Gewalt erreicht das nicht. Die verbessert nur eure Chancen, heile rauszukommen. 

Ich kann, darf und will Niemanden zu etwas zwingen, mit dem er oder sie nicht einverstanden ist.

Weil es nicht funktioniert.

Wir arbeiten hier mit Leuten zusammen, deren Hauptaufgabe es ist, kreative Lösungen zu finden. Was meint ihr was passiert, wenn man durch autoritäre Keulen diese Leute zum Ausleben dieser Fähigkeiten zwingt? - Das geht definitiv nach hinten los. Und wir haben bei Kundenprojekten nur einen Versuch. Wenn wir den Kunden also davon *überzeugen* können, dass unser Projektablauf stimmig, flüssig und vorhersagbar ist, dann **haben WIR in der Entwicklung bzw Produktion ein Maximum an Freiheiten!** 

JETZT zeige ich das System. 

Und ich weiß, dass gerade die Entwickler jetzt gleich versuchen werden, herauszulesen, wie ihnen dieses System bei ihren aktuellen Herausforderungen helfen könnte und daraus ableiten, ob das was für sie wäre und einen Stempel draufdrücken. Ich kann mich davon auch nicht ausnehmen. Passiert mir auch und ich muss mich jedesmal dazu zwingen, es nicht zu tun.

Also vergesst eure aktuellen Projekte für die nächsten Minuten und unterdrückt den Impuls zu jedem Buzzword irgendwas hinzufügen zu wollen oder herauszuhören, dass jetzt irgendwelche Verrenkungen von euch persönlich erwartet werden. Letzteres könnt ihr ausschließen. Das Thema der Anwendungsentwicklung ist komplex und groß, die Möglichkeiten nahezu unendlich. Und sehr viel intelligentere Leute als ich machen sich seit Jahrzehnten Gedanken darüber. 

Es wäre vermessen zu behaupten, ich wüsste, wie Webanwendungen am Besten gebaut werden, wie jemand beim Entwickeln vorgehen sollte oder was die beste Methode oder das beste Framework ist. Wie könnte ich auch?  

Aber beantworten kann ich die Frage trotzdem: "Die beste Methode, das beste Framework und die beste Vorgehensweise ist die, mit dem das Projekteam am besten klarkommt!".

Die kurze Vorstellung jetzt reicht überhaupt nicht aus, alle diese Möglichkeiten anzureißen. Dafür wird es Workshops geben. Erst für die Entwickelnden, dann für Scrummaster und Projektleiter. Und dann braucht aus aus jedem Teilbereich eine Person, die das System mitgestalten will. 

> 10 Minuten Pause. Holt euch ne Caprisonne. Dann zeige ich das System. 

Hier ist mein Vorschlag.

Ich habe es SHIBUYA getauft und es ist *kein* Framework. Es gibt einem Projekt Struktur. Ähnlich eines Drehbuchs, dass ja nicht die Geschichte ist, sondern der Geschichte Struktur und damit Halt gibt.

SHIBUYA ist das Framework Agnostic Development System, das die Komplexität der technischen sowie *sozialen* Abhängigkeiten in Einfachheit verwandelt. 

Ich präsentiere die Umgegbung aus Sicht einer Person, die neu in das Projekt kommt (OnBoarding), das bereits in seinen Grundzügen vom Admin/SHOGUN aufgesetzt wurde.

In einem Workshop werde ich zeigen, wie man beliebige Anwendungen und Frameworks in die Umgebung einbindet und die Struktur festzurrt. Das führt hier zu weit. Aber um zu zeigen, dass es völlig egal ist, was für Frameworks eingesetzt werden, zeige ich das Beispielprojekt mit Axum-API in Rust und dem etwas bekannterem Angular.

> Ich hatte hier mehrere APIs und FE-Frameworks angebunden, darunter: Nuxt, Astro, SvelteKit, ReactNative, Phoenix, TYPO3, .NET8, Java SpringBoot, Laravel und FastAPI in Python. Alle haben funktioniert. Selbst eine ElectronJS-App kann hiermit betrieben und entwickelt werden. Und ich sehe auch kein Hindernis, hiermit andere Desktop-Anwendungen mit Python oder C++ zu entwickeln.

## Das "KundenProjektName"-Projekt

Beim Onboarding ist der erste Schritt immer, sich das Projekt aus der Versionskontrolle zu holen. Das habe ich schon gemacht. Der Stand, der hier zu sehen ist, ist kurz nach dem `clone`. Der nächste Schritt ist immer der Installation der Abhängigkeiten.

> Die ersten Befehle und Handlungen, die nach dem `clone` ausgeführt und geprüft werden müssen, stehen immer in der obersten README.md-Datei!

```sh
pnpm install
```

> Wenn hier Fehler auftreten, fehlen notwendige Installationen!

Das Frontend (Angular) verwendet eine Authentifizierung gegen Keycloak und zieht sich Daten aus dem Backend (Rust-API), die die Daten in einer PostgrSQL-DB persisitiert bereithält und diese auch nur zurückgibt, wenn eine valide Anmeldung besteht.

So weit, so Standard.

Ich muss daher erstmal wissen, ob meine Workstation auch alles hat, was ich zum lokalen Betrieb brauche.

> Wenn ich versuche, ein Projekt zu starten und erhalte Fehlermeldungen, dass was nicht funktioniert, kann ich nur hoffen, dass die Meldungen eindeutig genug sind, damit ich es selbst beheben kann. Wenn nicht sind das wieder +5 FP. +10 wenn mir jemand sagen muss, was ich installiert haben muss.

Ich lasse also prüfen, ob meine Workstation alles erforderliche installiert hat mit: `pnpm shibuya:check`.

Für die Präsentation interessant ist Abschnitt 4.1. Hier stehen die Abhängigkeiten für das Betreiben der eigentlichen Anwendungen.

> Das ist nur für diejenigen im Projekt zwingend eforderlich, die mit den Anwendungen arbeiten. POs/SMs brauchen das nur, wenn sie mit am oder im Code mitarbeiten wollen/müssen.

Ist alles soweit installiert, will ich natürlich meiner Entwicklungsaufgabe nachkommen und starten.

Dafür müssen die Container in der infrastructure/ gebaut werden und laufen. Auch müssen Datenbaktabellen und vielleicht schon Daten voreingetragen werden, damit man nicht bei jedem Neustart seine Dummydaten neu erfassen muss.

> Um jetzt keine Sprachverwirrung auszulösen, ist der Befehl nicht *build*. Den brauchen wir für das Deployment.

Wir schmieden unsere Container mit `pnpm forge`.

> Es liegt leider in der Sache, dass die Container erst gebaut und dann gestartet werden. Liefern diese am Ende eine im Browser erreichbare Url, muss man manchmal etwas warten, bevor sie erreichbar ist. Gilt besonders für PG Admin.

Wo wir gerade von Urls sprechen. Woher weiß ich jetzt, welche Adressen und Ports zur Verfügung stehen? - In aller Regel ist das ja: `http://localhost:{PORT}`

Die Ports müsste ich mir jetzt zusammensuchen.

Ein weiterer Stolperstein, der uns weitere 10 Frustpunkte bringt. 

Wie wäre es mit einem projektweitem Portkonzept, dass sinnvolle Portzuordnungen vorschlägt, die man dann in den apps/ und der infrastructure/ verwendet? Also den SOLL-Zustand zeigt?

Das gibt es und es ist eine der fünf Säulen des gesamten Systems = SUIDO (Leitung, Kanalisation)

Wir lassen uns die zugeordneten Ports anzeigen mit `pnpm suido:urls`

Da ich die Anwendungen noch nicht für die Entwicklung gestartet habe, funktionieren nur die Webseiten der Infrastruktur-Container.

Muss ich als Neuling noch was über das Projekt wissen? Tja, keine Ahnung. Wie erfahr ich das? - Indem ich den BUGYO-Distrikt besuche: MOKUROKU. 

> Diesen Distrikt zu bewohnen oder zu nutzen, liegt absolut in den Vereinbarungen, die das Projektteam fällt!

Aber wenn, kann ich ihn mit `pnpm mokuroku:view` besuchen.

> Hier kann man alle relevanten Informationen über die Markdown-Dateien erfassen. Was von Relevanz ist, entscheidet ebenfalls das Projektteam. Sensible Informationen, wie die bekannte "Aktennotiz" kann *verschlüsselt* im Repo eingecheckt werden und nur von denen entschlüsselt werden, die den Schlüssel haben! Ein "Kann". Kein "Muss".

Die Arbeitsschritte und was dafür nötig ist in einem separaten Workshop!

Jetzt brauche ich nur noch `pnpm dev` ausführen und kann meine Hände im Code vergraben, meine Aufgabe lösen, committen und bin fertig.

Während ich am Code arbeite, kann ich jederzeit die Cointainer steuern, Dokumente in Mokuroku verändern und sogar das gesamte System plattmachen und neu ansetzen.

## FAZIT

SHIBUYA hat nichts Neues. Es ist auch nichts Neues geschaffen worden. Es strukturiert nur die Dinge und gibt ihnen einen Ort und einen Namen.

Was hier geschaffen wurde ist, dass der Anfahrtsweg zur Baustelle asphaltiert, ausgeschildert und beleuchtet wurde. Der Bauplatz selbst bietet Platz für die Fertigung, Verwaltung und Auslieferung, die voneinander abgegrenzt sind. Von dem kein Teil eine Größenbeschränkung hat und somit voll skalierbar ist. Und das ohne Vorgaben und Einschränkungen für beliebige Vorgehensweisen und das unter Ausnutzung von Funktionalitäten, die eh da sind.

Um Missverständnisse durch doppeldeutige Bezeichnungen, Namen und Befehle zu verhindern, wurden eigene Namen und Rollen definiert, mit denen man sich hier im Distrikt verständigen kann. Und eine Karte mit Mondrunen entfällt, da alles an einem Ort ist. Und falls man doch eine Karte braucht, befindet sie sich im Katalog.

Auch wurde Wert auf die Energiewirtschaft gelegt und Wege kurz gehalten. Tools wie `NX` sorgen für performantes Building und *Präzision der Befehle*.

Der Fokus auf die DeveloperExperience und sich selbst dokumentierende Prozesse beschleunigt die Produktion und die Eindeutigkeit der Kommunikation für Transparenz weit über die eigentliche Entwicklungsarbeit hinaus.

Klingt das gut?

---

[^brownbag]: Früher haben Angestellte ihr Mittagessen in braunen Papiertüten rumgetragen (Was auch nur eine an den Haaren herbeigezogene Behauptung war). Dieses Meeting sollte in der Küche stattfinden, wo jemand etwas präsentiert, während der Rest sein Mittag verputzt. Man kann da bestimmt drüber streiten, aber ich finde das grotesk.
