# MOKUROKU HARDBOILED

Mokuroku bietet nicht nur die statische Dokumentation über Markdown-Dateien, sondern bietet darüberhinaus noch eine automatisierbare Erfassung der *Retrospektiv*-Meetings und die Erfassung **verschlüsseler Notizen**.

Das ist was für hartgesottene Terminal-Benutzer und die, die es werden wollen. Und es lohnt sich!

Erforderliche Grundkenntnisse:

- Grundlagen der Terminalnutzung (Navigation, Ordner-Verzeichnisse)
- Git (Git Push/Pull und Wechseln des Branches)
- Editieren einer Datei mit [Vim](https://www.vim.org/download.php) oder [NeoVim](https://neovim.io/)
- Handhabung des Verschlüsselungskeys beim Anlegen von Notizen. (Sonderfall! Benutzung nur, wenn volle Teamakzeptanz besteht)

> Um der Wahrheit die Ehre zu geben, ist **das Anlegen verschlüsselter Notizen** das einzige Feature, das ich persönlich ziemlich gut finde und es deshalb mit drin gelassen habe. Wohl wissend, dass es nur selten angewendet werden wird, weil es dann doch etwas mehr Handling voraussetzt.

Der Ablauf ist für die Retrodokumentation und die verschlüsselten Notizen gleich. Nur die Verschlüsselung erfordert extra Schritte. Die kommen später.

Zur Orientierung: Wenn das Projektteam nichts anderes entschieden hat, wird empfohlen, Notizen und Retro-Protokolle im Entwicklungsbranch (im Allgemeinen `develop`) vorzunehmen.

1. Das Reviewmeeting wird im Allgemeinen aus dem `develop` gemacht
2. `develop` ist immer ein lauffähiger Stand
3. `develop` kann bei Bedarf in die `feature`-Branches gemergt werden.
4. Setzt kein Branch-Hopping voraus

## mokuroku:retro

Um die Ergebnisse (Action-Items) festzuhalten, kann die Vorlage aus dem `mokuroku/.templates/retro.md` verwendet werden. Es gibt hier zwei Möglichkeiten:

### 1. Kopieren der Template-Datei

Kopiere die `retro.md` aus `mokuroku/.templates/` in das `mokuroku/retro/`-Verzeichnis.

Gib der Datei einen sinnvollen Namen. Bspw `2026-02-24-sprint-001.md`.

Erfasse die Daten und committe die Datei und pushe sie ins Repo.

> Die Vorlage ist nicht in Stein gemeißelt. Das Projektteam entscheidet, was alles in das Protokoll gehört! Es kann selbstverständlich angepasst werden.

### 2. Automatisierte Erfassung

Wem das Kopieren und Umbennen zu anstrengend ist, kann das auch in einem Schritt über den RUN-Command `pnpm mokuroku:retro -t "Sprint 001"` tun.

Nach der Ausführung wird eine MD-Datei in den `retro`-Ordner gelegt. Der Dateiname wird durch den Zeitstempel und dem serialisiertem Titel automatisch bestimmt. Ist in eurer `.bashrc` ein Standard-Editor (s. `07-HARDBOILED.md`) konfiguriert, dann öffnet sich die IDE mit der Datei.

```markdown
# 🔄 Retro-Beschluss: Sprint 001

* **Datum:** 11.2.2026
* **Moderation:** Sven Schoppe <sven.schoppe@link-innovation.de>

## 🎯 Fokus der Retrospektive

*Kurze Beschreibung des Schwerpunkts.*

## ✅ Beschlüsse & Änderungen

*Was wurde konkret entschieden? Wer setzt es um?*

## 🏁 Action Items

- [ ] ...
- [ ] ...
- [ ] ...
```

Der Titel wurde ja beim Aufruf mitgegeben und die Platzhalter werden aus den Umgebungsvariablen von Git befüllt.

Korrigieren kann man jederzeit. Löschen geht auch. Aber da es immer eingecheckt werden muss, sehen wir ja, was mit der Datei über die Zeit passiert ist. Und schon brauche ich keinerlei Zusatzabsprachen und laufe auch nicht Gefahr, das jemand heimlich einen Beschluss ändert. Ein Gefahr, die bei Fremdsystemen durchaus besteht.

## mokuroku:notes

Im Vergleich zu den Retro-Protokollen können wir Notizen zusätzlich noch verschlüsseln. Dann sind sie eine Binärdatei, die nicht lesbar ist, wenn man in bspw GitLab, Bitbucket oder Github die Datei anklickt. Für diejenigen, die den Schlüssel nicht besitzen, wird auch nichts entschlüsselt.

> Die Notizen sind nur von denen zu bearbeiten und einsehbar, die auch im Besitz des Schlüssels sind.


```sh
# Lege eine Verzeichnisebene über dem Repo einen Ordner für den Schlüssel an
mkdir -p ./../.shibuya-vault

# Generiere ein starkes PAsswort und schreibe die Schlüsseldatei
# Dateiname kann frei gewählt werden
openssl rand -base64 32 > ../.shibuya-vault/project-kpn.key

# Passe die Dateiberechtigungen an
chmod 600 ../.shibuya-vault/project-kpn.key
```




### Schlüssel generieren (einmalig)

Wir generieren einen Schlüssel und legen ihn *vor* das Repository.

```sh
# Der Schlüsselname ist nicht beliebig.
# Die SHIBUYA-Skripte suchen den Key eine Verzeichnis-Ebene vor dem Repo nach diesem Namen.
# Daher muss er auch in der Ebene mit dem Namen abgelegt werden. 
openssl rand -base64 32 > ./../.shibuya-vault.key

# Dateiberechtigung setzen
chmod 600 ./../.shibuya-vault.key
```


Damit GPG ohne Passwort-Abfrage (bzw. nur mit einmaliger Agent-Freigabe) arbeitet, brauchen wir ein Schlüsselpaar:

* **WICHTIG**: Nutze die E-Mail, die du auch in deinem `checkGitSetup()` im Script verwendest.
* **Passphrase**: Wenn du eine vergibst, merkt sich der `gpg-agent` diese für deine Session.

```sh
# Erstelle einen neuen Schlüssel (Wähle "RSA and RSA" und "4096" Bit)
gpg --full-generate-key

gpg (GnuPG) 2.4.4; Copyright (C) 2024 g10 Code GmbH
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (9) ECC (sign and encrypt) *default*
  (10) ECC (sign only)
  (14) Existing key from card
Your selection? 1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072)
Requested keysize is 3072 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 0
Key does not expire at all
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: Sven Schoppe
Email address: sven.schoppe@link-innovation.de
Comment:
You selected this USER-ID:
    "Sven Schoppe <sven.schoppe@link-innovation.de>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit?
```

Dann zeigt das Terminal, was es kann.

```sh
┌──────────────────────────────────────────────────────┐
│ Please enter the passphrase to                       │
│ protect your new key                                 │
│                                                      │
│ Passphrase: ********________________________________ │
│                                                      │
│       <OK>                              <Cancel>     │
└──────────────────────────────────────────────────────┘

We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
gpg: /home/ssch/.gnupg/trustdb.gpg: trustdb created
gpg: directory '/home/ssch/.gnupg/openpgp-revocs.d' created
gpg: revocation certificate stored as '/home/ssch/.gnupg/openpgp-revocs.d/2913656ECB...E1.rev'
public and secret key created and signed.

pub   rsa3072 2026-02-11 [SC]
      2913656ECBAA85F2DED8AE40E4F99CD14E98FAE1
uid                      Sven Schoppe <sven.schoppe@link-innovation.de>
sub   rsa3072 2026-02-11 [E]
```

> **WICHTIG** Die Email-Adresse muss mit der aus der git config übereinstimmen!

```sh

# Prüfen
gpg --list-secret-keys --keyid-format LONG

gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
/home/ssch/.gnupg/pubring.kbx
-----------------------------
sec   rsa3072/E4F99CD14E98FAE1 2026-02-11 [SC]
      2913656ECBAA85F2DED8AE40E4F99CD14E98FAE1
uid                 [ultimate] Sven Schoppe <sven.schoppe@link-innovation.de>
ssb   rsa3072/063EDD4A3F05EA7D 2026-02-11 [E]
```

Hier passiert nichts automatisch. Das heißt, wenn notes angelegt werden müssen, muss erst `unlock` ausgeführt werden, dann kann man arbeiten, dann wieder `lock` und committen.

> Es könnte jemand auf den Gedanken kommen, dass die Notes dann ja keine Git-Historie über ihre Änderungen erhalten. Das stimmt ja auch. Aber das ist kein Nachteil. Denn an diesen Dateien DARF es weder Änderungen noch Löschungen geben. Sollte sich eine Notiz als falsch erweisen, wird das im Text einfch mit bspw "Notiz obsolet!" erwähnt.
