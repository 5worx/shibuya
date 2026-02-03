# Lose Ideensammlung

## Die Situationsbeschreibung

> Wenn es zu einer Anwendungsentwicklung kommt, ist der Projektordner mit seinen Anwendungen für 4/5 des gesamten Projektteams eine "BlackBox". Und das kann sich sehr schnell zu einer "PandoraBox" entwickeln.

Eine "Gute Anwendung" zeichnet sich dadurch aus, ob sie den vom Auftraggeber gewünschten Mehrwert bietet und wenn alle Beteiligten flüssig arbeiten und Informationen austauschen können. Den ersten Teil sicherzustellen ist Aufgabe derer, die die Anwendung planen und konzipieren. Dafür gibt es POs und UI/UX-Designer. Der zweite Teil hingegen ist eine Gemeinschaftsaufgabe.

Als Entwickler ist es mein Job, ein System zu entwickeln, von dem ich zu jedem Zeitpunkt eine klare Aussage zum aktuellen Zustand jedem Projektbeteiligtem gegenüber treffen können muss. Das müssen FE, BE, Tester und DevOps gleichermassen tun.
Als PO/SM muss ich das auch UND habe zusätzlich noch die Bringschuld gegenüber Kunden und Geschäftsführung, was den Kosten-Zeit-Faktor angeht.

> Ich habe hier Susanne, Tobias, Mark und Nelli als Projetleiter kennengelernt und jedesmal hatte ich den Eindruck, dass sie immer wieder hinter allem herrennen mussten, um Infos zum IST-Zustand zu sammeln. Das ist dann eher ein Job als Pressesprecher. Man ist an keiner Entscheidung beteiligt, muss sie aber vertreten. Nicht schön.

Aus der Vogelperspektive sieht das dann aus wie kleine Inseln in einem Archipel, dass man "Projekt" nennt. Und wenn man scharf hinsieht, kann man die Projektleiter sehen, wie sie auf sehr kreative Weise versuchen, von Insel zu Insel zu kommen. Und wenn man Strömungen, Untiefen und Kauversuchen der Haie ausgewichen ist, weiß auf der Insel vielleicht niemand die Antwort, gesetzt den Fall, man findet das lichtscheue Gesindel überhaupt im Dickicht.

Das ist ja nicht nur bei uns so. Das kann ich versichern.

Um das Problem zu lösen, verabredeten manche Meetings mit sehr kreativen Namen wie bspw das "Brownbag-Meeting"[^brownbag]. Oder Workshops, Weiterbildungen, Entwicklerrunden und Projektvorstellungen um denen von den anderen Inseln, die eigene Lebensart und Sprache vorzustellen und um zu verhindern, das sich separate Lebensräume bilden. Das macht viel Spaß und jeder wird mit dem Gefühl der Bereicherung wieder nach Hause schippern... und morgen ist das alles wieder wie immer, weil der eigene Inselalltag wartet.

Bei aller Südsseromantik und dem Wunsch nach dem Ursprünglichem: Lasst uns umziehen. Vom Archipel in einen modernen Stadtteil mit fließend Wasser. Lasst die Inselbewohner ihre eigenen Distrikte aufbauen, die jeder jederzeit besuchen kann. Und das möglichst ohne Karte in fremder Sprache, die mit Runen versehen ist, die nur bei Vollmond von einem Elben oder Zauberer gelesen werden können.

Wie dieser Distrikt aussieht, beschreibe ich gleich, vorher muss ich kurz erläutern, wie es dazu gekommen ist. Denn es war nicht der Plan, ein Development System zu entwerfen. Das ist eher das Abfallprodukt. Aber wie mein Kunstlehrer zu sagen pflegte: "Manchmal kann man daraus noch was machen."

Wie manchen bekannt sein sollte, haben wir seit Juni eine schwierigere Situation und einige befinden sich in der Weiterbildung. Mein "Auftrag" dabei war, sich in TYPO3 einzuarbeiten. Dann aber auch in Angular und dann wollte jemand wissen, ob man TYPO3 nicht headless betreiben, und mit Angular und WebComponents darstellen könnte. Ich fand die Frage merkwürdig, denn die Antwort ist: "Ja, klar!". Um das zu zeigen, setzte ich TYPO3 auf, ein Angular Projekt und entschied mich für Stencil zum Bauen der WebComponents.

> Nur zur Info: Wenn man mit Stencil entwickelt, gibt es localhost-Adresse mit dem Javascript. Für den Build braucht es eine andere Lösung.

Also habe ich die WebComponents-Url in mein Angular als externe Resource eingebunden, einige Beispielseiten in TYPO3 mit Inhalten befüllt und die Adressen als Service in Angular implementiert. Und ja, geht. 

Aber das ist ja nicht die ganze Geschichte. Dazu gehört noch viel mehr.

Es stellte sich die Frage, wie deploye ich das eigentlich? Wie gehe ich mit Änderungen in den WebComponents um? Was müssen die CD-Pipelines machen, damit ein derartiges Konstrukt auch Live gehen kann? Wie koordiniere ich die Arbeiten an den Bestandteilen? Und ... wie erkläre ich das den Kollegen und was müssen denn Scrummaster und der PO darüber wissen, um eine halbwegs zeitgenaue Planung zu erreichen? 

Klar, man kann das alles irgendwie dokumentieren und in irgendwelchen Wikis festhalten. Schon schreibe ich nur noch Dokus und überall liegen Duden und Rechtschreibbücher rum. Und das muss dann auch noch wer lesen wollen und vor allem verstehen können. Das ist Quälerei. Für alle. 

> Der Beruf des "Technischen Redakteurs" ist nicht grundlos ein Akademischer. Und das sind wir nicht. Deswegen sind die meisten Rufe nach ausufernder Dokumentation mit Diagrammen und Berechnungen oft Teil des Problems anstatt Teil der Lösung. Wie sagte der britische Autor Douglas Adams? "Woran erkennt man unzureichend gut entwickelte Technik? - Wenn ein Handbuch dabei liegt.". Nebenbei gesagt, haben diese Handbücher auch eher den Charakter der Vorlage für den oben erwähnten Pressesprecher.

Und so stellte sich heraus, das die Frage eigentlich lauten sollte: "Wie würde man mit einer derartigen Architektur aus Headless-CMS + DB, MVVM-Framework und Component-Framework entwickeln?". Die Antwort war schnell gefunden: "Unter großen Schwierigkeiten!" - Und diese Anwort gefiel mir nicht. 

Ohne jetzt weiter ins Detail gehen zu wollen, man muss eine Menge Abhängigkeiten schaffen, die sofort genau diesen Doku-Aufwand nach sich ziehen. Das ist bestimmt einmal möglich. Aber dann kennen sich auch nur wieder die damit aus, die sich das Konstrukt damals ausgedacht haben, was immer zu Störungen im Arbeitsfluss derer führt, die Resourcen und Verfügbarkiten prüfen. Aber es heißt doch "WorkFLOW" und nicht "WorkStopAndGo". 

Tja, und dann ändert sich auf einmal der TechStack und ich steh im "WorkSTAU". Sackgasse. Ende. Jetzt braucht es die Eloquenz der Geschäftsführer, die die Kuh jetzt irgendwie vom Eis schubsen müssen und das mit Zugeständnissen, die die Weiterarbeit nicht zwingend angenehmer machen und noch seltener im Sinn der Entwickelnden sind.

Schätze, wir können uns darauf einigen, dass niemand Interesse daran hat.  

Es hat aber auch keiner Interesse daran, auf bestimmte Wege und Arbeitsweisen gezwungen zu werden oder ein hartes Dogma durchzusetzen. Das klappt nämlich nicht. Dazu müssten alle eingesetzten Systeme auf denen das aufbaut, sich niemals ändern. Und das Umfeld auch nicht.  
Auch hat niemand Bock, ständig hinter irgendwas oder irgendwem herrennen zu müssen auch nicht das Gefühl haben wollen, etwas oder jemand wäre hinter einem her.

---

Ich bin Webentwickler geworden, um mit den Werkzeugen des Internets Lösungen zu finden, Projekte und Projektideen umzusetzen. Das ist ein kreativer Prozess. Und in einem kreativen Prozess stellt man Fragen an sein "Werk".

Um jetzt die eigentliche Frage beantworten zu können, stellte ich also Fragen: "Wie will *ich* damit arbeiten und wie kann ich alle aufkommenden Fragen diesbzüglich beantworten, wenn sie gestellt werden?"

Was dann folgte, war eine längere Abfolge aufgesetzter Systeme und Konstellationen und wie man sie zusammen spielen lassen muss, um das zu beantworten. Und jedesmal stellte ich die gleichen Fragen an den Code.

Keine Angst, ich gehe das nicht durch. Könnte ich auch nicht, davon ist Vieles defenstriert.

Ich zeige das Ergebnis. Also gleich.

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

> Ich betone das hier nur, um klar zu stellen, dass ich hier keinen cleveren Code vorstelle, um zu beeindrucken, sondern eine Projektstruktur, die es ermöglicht, die **Stärken einer solch heterogenen Umgebung zu nutzen**.

Was habe ich also für Möglichkeiten, damit alle in das Projekt während der Produktion einsehen und daraus eine eindeutige Aussage zum Status des Produktes treffen können?

Eigentlich nur eine: Die Versionskontrolle. Alles andere ist ein Kompromiss oder ein Ausweichen, aber auf jeden Fall mit Zusatzarbeiten behaftet.

> Ich fand das schon bei PrIMA merkwürdig, dass ausser den FE-/BE-Entwicklern, niemand in das Repo geschaut hat und nicht die Möglichkeiten von BitBucket ausgeschöpft wurden. Stattdessen wurde auf andere Portale ausgewichen und separate Dokumentationen und verteilte Dokumente gepflegt. Aber nicht regelmässig. Und schon garnicht dafür ausgelegt, dass man damit hätte arbeiten können.

Versionskontrollen wie Git können unfassbar viel. Das Ding ist darauf ausgelegt, weltweite Kernelentwicklung für eine absolut heterogene Welt von Distributionen auf allen existierenden Geräten und in Potenzia zu koordinieren. Und das verlässlich.

"Kann ich in einem IT-Unternehmen erwarten, dass alle, die mit der Produktion digitaler Produkte direkt betraut sind, sich mit den Grundzügen der Versionskontrolle auskennen?" 

Ich meine, ja. Auf jeden Fall. Schon aus ganz egoistischen Gründen. Ich will *meinen* Tag planen und nicht *meinen* Ablauf nach den Tagesplänen anderer ausrichten. Ich will auch nicht, dass das jemand anderes tut.

Niemand käme auf die Idee, das Tobias oder Axel beim Auflösen von Mergekonflikten helfen sollten, oder eine geschickte Branchstrategie vorgeben. Genausowenig würde ich von den Vertrieblern erwarten, dass sie Pull-Requests stellen. Aber von den Anwendungsentwicklern kann und muss ich das. Ich vertraue darauf, dass jeder seine Aufgabe erfüllen will und wenn ich dabei helfen kann... wunderbar.

Was wäre denn eine realistische Erwartungshaltung an alle Projektbeteiligten? Das ist eine intressante Debatte, die wir an anderer Stelle diskutieren sollten. Das war im Selbstgespräch schon spannend. Ich habe hinterher nicht mehr mit mir gesprochen, weil rauskam, dass ich selbst auch einen höheren Anspruch an mich selbst hätte stellen müssen.

Himmel, was hat mich das bei PrIMA genervt. Dauernd wollten die Externen vollkommen nutzlose Diagramme und Auswertungen von Nelli haben, von denen ich ihr Teile zusammenstellen musste. Und ich war nicht von Nelli genervt, der ging das ja genauso oder das ich das machen musste, weil ich die notwendigen Befehle kannte. Sondern einzig und allein darüber, dass es Verschwendung unserer Qualitätszeit war.

Mal ehrlich: Codecoverage als Qualitätsmerkmal? Versionen eingesetzter Node-Pakete als Zeichen der Modernität? Vollkommener Quatsch.

Zeit ist wertvoll. Meine Zeit ist wertvoll und damit auch automatisch, die aller anderen. Daraus ergibt sich eine klare Konsequenz: "Ich arbeite so, dass andere darauf aufbauen können!" oder wie es meine Chefin bei AB@Media ausdrückte: "Gehe sorgfältig mit der Zeit deines Gegenübers um.". Das findet sich auch in den Prinzipien des Agilen Manifests. 

Das Entwicklungssystem, dass ich jetzt wirklich gleich vorstellen werde, nimmt darauf Rücksicht. Es ist so ausgelegt, dass man mit den einfachsten Befehlen das Projekt und dessen Status einsehen und sogar mitgestalten kann, ohne sich zusätzlich in was Neues einarbeiten zu müssen.

Ja, für einige ist das Arbeiten mit Versionskontrollen eine Hürde. Aber die ist flach und gepolstert. Ich behaupte, dass ich jedem hier im Raum innerhalb einer Stunde alles Notwendige zu einem Repo zeigen und beibringen kann. Und nein, man kann keinen irreversiblen Schaden anrichten. Das müsste man wollen und die Repoberechtigungen dazu haben.

Und das ist auch schon alles. Mehr braucht es nicht, um die Lücke zu schließen und Srummastern, Projektleitern und anderen direkt und indirekt Beteiligten Zugang zum IST-Zustand zu ermöglichen.

* git clone, pull, commit, push - Das ist alles.

Im System sind Bereiche nur für die Dokumentation des Projektablaufs angelegt, die automatich genau das leisten können, was vorher von zwei Menschen aktiv manuell auf unterschiedlichen Plattformen ausgeführt werden musste.

Und bei aller Scheu vor der Kommandozeile oder dem Linux Subsystem. Es lohnt sich, diese zu verlieren. Und das ist kein langer Prozess. Eine Stunde, 10-20 Wiederholungen der wichtigsten Workflows und schon hat das jeder drauf. Das ist gut investierte Zeit. Und jeder Entwickler kann jederzeit helfen.

> One Workshop to rule them all!

Ich wollte das Entwicklungssystem zeigen, richtig? - Gleich.

Ich habe lange Zeit als Türsteher und Veranstaltungsschützer gearbeitet. Die wirkungsvollste Waffe ist die **Überzeugung**. Nur sie bringt aufgebrachte Menschen dazu, ihre Handlungen zu überdenken. Gewalt erreicht das nicht. Die verbessert nur eure Chancen, heile rauszukommen. 

Ich kann, darf und will Niemanden zu etwas zwingen, mit dem er oder sie nicht einverstanden ist. - Weil es nicht funktioniert.

Wir arbeiten hier mit Leuten zusammen, deren Hauptaufgabe es ist, kreative Lösungen zu finden. Was meint ihr was passiert, wenn man durch autoritäre Keulen diese Leute zum Ausleben dieser Fähigkeiten zwingt? - Das geht definitiv nach hinten los. Und wir haben bei Kundenprojekten nur einen Versuch. Wenn wir den Kunden also davon überzeugen können, dass unser Projektablauf stimmig, flüssig und vorhersagbar ist, dann **haben wir ein Maximum an Freiheit!**

JETZT zeige ich das System. Und ich weiß, dass gerade die Entwickler jetzt gleich versuchen werden, herauszulesen, wie ihnen dieses System bei ihren aktuellen Herausforderungen helfen könnte und daraus ableiten, ob das was für sie wäre und einen Stempel draufdrücken. Ich kann mich davon auch nicht ausnehmen. Passiert mir auch und ich muss mich jedesmal dazu zwingen, es nicht zu tun.

Also vergesst eure aktuellen Projekte für die nächsten Minuten und unterdrückt den Impuls zu jedem Buzzword irgendwas hinzufügen zu wollen oder herauszuhören, dass jetzt irgendwelche Verrenkungen von euch persönlich erwartet werden. Letzteres könnt ihr ausschließen. Das Thema der Anwendungsentwicklung ist komplex und groß, die Möglichkeiten nahezu unendlich. Und sehr viel intelligentere Leute als ich, machen sich seit Jahrzehnten Gedanken darüber. 

Die kurze Vorstellung jetzt reicht übehaupt nicht aus, alle diese Möglichkeiten anzureißen. Dafür wird es Workshops geben. Erst für die Entwickelnden, dann für Scrummaster und Projektleiter. Und dann braucht aus aus jedem Teilbereich eine Person, die das System mitgestalten will. 

Die Erfahrungen der letzten drei Jahrzehnte, die Erfahrung aus unterschiedlichen Unternehmen hat mich hierhin gebracht. Aber weiter werde ich ohne Hilfe jetzt nicht mehr kommen.

> 10 Minuten Pause. Holt euch ne Caprisonne. Dann zeige ich das System. 

Es wäre vermessen zu behaupten, ich wüsste, wie Webanwendungen am Besten gebaut werden, wie jemand beim Entwickeln vorgehen sollte oder was die beste Methode oder das beste Framework ist. Wie könnte ich auch?  
Aber beantworten kann ich die Frage trotzdem: "Die beste Methode, das beste Framework und die beste Vorgehensweise ist die, mit dem das Projekteam am besten klarkommt!".

Hier ist mein Vorschlag.

Ich habe es SHIBUYA getauft und es ist kein Framework. Es ist eine Umgebung mit Struktur. Ähnlich eines Drehbuchs, dass ja nicht die Geschichte ist, sondern der Geschichte Struktur und damit Halt gibt.

SHIBUYA ist das Framework Agnostic Development System, das Komplexität in Einfachheit verwandelt. 

In einem Workshop werde ich zeigen, wie man beliebige Anwendungen und Frameworks in die Umgebung einbindet. Das führt hier zu weit. Aber um zu zeigen, dass es völlig egal ist, was Frameworks eingesetzt werden, zeige ich Beispielprojekt mit Rust-API, Laravel-FullStack und dem etwas bekannterem Angular.

Angular verwendet eine Authentifizierung gegen Keycloak und zieht sich Daten aus der Rust-API, die die Daten in einer PostgrSQL-DB persisitiert.




---
## schnipsel

> Die wichtigste Waffe bei der Entwicklung ist die **Überzeugung**!













---

[^brownbag]: Früher haben Angestellte ihr Mittagessen in braunen Papiertüten rumgetragen. Dises Meeting sollte in der Küche stattfinden, wo jemand etwas präsentiert, während der Rest sein Mittag verputzt. Man kann da bestimmt drüber streiten, aber ich finde das grotesk.
