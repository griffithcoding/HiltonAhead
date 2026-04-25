"""
One-shot updater: write Unsplash image URLs into data/localBusinesses.ts heroImage.src
fields, plus apply verified data corrections from the research pass.

Each business is identified by a fragment of its `alt:` text (which is unique per
business). For each fragment, we find the empty `src: '',` line directly above and
replace it with the Unsplash CDN URL. Also handles the legacy `src: '', // TODO: REPLACE`
format used in restaurants.
"""
import re
import sys
from pathlib import Path

DATA_FILE = Path(r"C:\Users\wgrif\Projects\HiltonAhead\data\localBusinesses.ts")

# (alt_substring, unsplash_photo_id)
# alt_substring must be unique per business and appear in the alt: 'XYZ' line.
IMAGE_MAP = [
    # Restaurants
    ("The Salty Dog Cafe at South Beach Marina", "1414235077428-338989a2e8c0"),
    ("Hudson's Seafood House on the Docks", "1559339352-11d035aa65de"),
    ("Skull Creek Boathouse waterfront", "1473093295043-cdd812d0e601"),
    ("Old Oyster Factory restaurant on Broad Creek", "1565299624946-b28f40a0ae38"),
    ("Charlie's L'Etoile Verte French bistro", "1592861956120-e524fc739696"),
    ("One Hot Mama's American Grill", "1544025162-d76694265947"),
    ("A Lowcountry Backyard Restaurant", "1485921325833-c519f76c4927"),
    ("Poseidon rooftop restaurant at Shelter Cove", "1544148103-0773bf10d330"),
    ("Gusto Ristorante Italian restaurant", "1551218808-94e220e084d2"),
    ("Truffles Cafe, Hilton Head Island", "1473093295043-cdd812d0e601"),

    # Water Activities
    ("Outside Hilton Head guided kayak and dolphin tour", "1572715376701-98568319fd0b"),
    ("Vagabond Cruise dolphin tour at Harbour Town", "1517248135467-4c7edcad34c4"),
    ("H2O Sports parasailing and kayak tours", "1530053969600-caed2596d242"),
    ("Kayak Hilton Head guided dolphin kayak tour", "1527515637462-cff94eecc1ac"),
    ("Island Water Sports sailing and kayak", "1502209524164-acea936639a2"),
    ("Kayak rental on Palmetto Dunes lagoon", "1466637574441-749b8f19452f"),
    ("Lowcountry Watersports dolphin tour at Palmetto Bay", "1517824806704-9040b037703b"),
    ("Parasailing over Hilton Head Island with Sky Pirate", "1604079628040-94301bb21b91"),
    ("Jet ski and boat rentals at Sea Monkeys", "1530053969600-caed2596d242"),
    ("Wakeboarding and dolphin tour charter with Live OAC", "1559827260-dc66d52bef19"),

    # Golf
    ("Harbour Town Golf Links 18th hole with lighthouse", "1587174486073-ae5e5cff23aa"),
    ("Heron Point by Pete Dye golf course", "1535131749006-b7f58c99034b"),
    ("Atlantic Dunes by Davis Love III golf course", "1592919505780-303950717480"),
    ("Robert Trent Jones Oceanside Course at Palmetto Dunes", "1500932334442-8761ee4810a7"),
    ("Arthur Hills Golf Course at Palmetto Dunes", "1538648759472-7251f7cb2c2f"),
    ("George Fazio Golf Course at Palmetto Dunes", "1632946269126-0f8edbe8b068"),
    ("Shipyard Golf Club fairway through Carolina pines", "1623567341691-1f47b5cf949e"),
    ("Palmetto Hall Plantation golf course", "1592937238247-cd0090e02f65"),
    ("Country Club of Hilton Head golf course", "1605144884374-ecbb643615f6"),
    ("Hilton Head National Golf Club fairway, Bluffton", "1587205476864-4a5a195167b4"),

    # Vacation Rentals
    ("Sea Pines Resort villas and Harbour Town marina", "1507525428034-b723cf961d3e"),
    ("Palmetto Dunes Oceanfront Resort rental villas", "1571003123894-1f0594d2b5d9"),
    ("Hilton Head Island vacation rental villa managed by The Vacation Company", "1564013799919-ab600027ffc6"),
    ("Hilton Head Island oceanfront vacation rental, Vacasa portfolio", "1502672260266-1c1ef2d93688"),
    ("Luxury oceanfront vacation home on Hilton Head Island, Beach Properties", "1582719508461-905c673771fd"),
    ("Hilton Head Island luxury vacation villa managed by Destination Vacation", "1540518614846-7eded433c457"),
    ("Hilton Head Island vacation rental, Sunset Rentals portfolio", "1505691938895-1758d7feb511"),
    ("Dunes Real Estate office, Hilton Head Island vacation rental", "1583847268964-b28dc8f51f92"),
    ("Oceanfront vacation rental in Forest Beach, Hilton Head Island", "1582719508461-905c673771fd"),
    ("Luxury vacation home rental managed by Island Time Hilton Head", "1564013799919-ab600027ffc6"),

    # Weddings
    ("Oceanfront wedding ceremony at The Westin Hilton Head Island", "1519225421980-715cb0215aed"),
    ("Wedding reception at Omni Hilton Head Oceanfront Resort", "1519741497674-611481863552"),
    ("Sea Pines Beach Club oceanfront wedding venue", "1525258946800-98cfd641d0de"),
    ("The Inn and Club at Harbour Town, Hilton Head Island wedding", "1464366400600-7168b8af9bc3"),
    ("Harbour Town Yacht Club wedding venue, marina views", "1469854523086-cc02fe5d8800"),
    ("Palmetto Dunes outdoor wedding venue", "1583416750470-965b2707b355"),
    ("Hilton Beachfront Resort oceanfront wedding event space", "1540575467063-178a50c2df87"),
    ("Amanda Rose Weddings beach wedding planning", "1606490194859-07c18c9f0968"),
    ("Spencer Special Events luxury wedding design", "1519741497674-611481863552"),
    ("Simply Southern Events Lowcountry beach wedding coordination", "1464366400600-7168b8af9bc3"),

    # Spas & Wellness
    ("Heavenly Spa by Westin treatment room", "1540555700478-4be289fbecef"),
    ("Ocean Tides Spa at Omni Hilton Head resort", "1591343395082-e120087004b4"),
    ("Spa Soleil treatment room at Hilton Beachfront Resort", "1600334129128-685c5582fd35"),
    ("Hilton Head Health wellness retreat campus", "1571896349842-33c89424de2d"),
    ("Art of Massage and Yoga wellness studio", "1545389336-cf090694435e"),
    ("Jiva Yoga Center studio class", "1545205597-3d9d02c29597"),
    ("Beach yoga class on Hilton Head Island", "1506126613408-eca07ce68773"),
    ("Bikram Hot Yoga studio interior", "1599447421416-3414500d18a5"),
    ("Back In Balance Wellness Spa massage therapy", "1600334129128-685c5582fd35"),
    ("Hilton Head Island Spa & Wellness boutique day spa treatment room", "1540555700478-4be289fbecef"),

    # Shopping
    ("The Village at Wexford courtyard shopping center", "1572533177115-5bea803c0f49"),
    ("Coligny Plaza beach shopping center, Forest Beach", "1599643477877-530eb83abc8e"),
    ("Shelter Cove Towne Centre waterfront shopping", "1517696522815-46a004b80a2d"),
    ("Harbour Town lighthouse boutiques and shops", "1582517339790-63168430ee86"),
    ("Coastal Bliss Boutique women's clothing store", "1572533177115-5bea803c0f49"),
    ("Gifted Hilton Head fine jewelry and gift boutique", "1599643477877-530eb83abc8e"),
    ("Nash Gallery fine American craft at Shelter Cove", "1545558014401-f43c5b4b4f55"),
    ("Vivid Gallery Lowcountry photography", "1545558014401-f43c5b4b4f55"),
    ("Hilton Head Outfitters bike and kayak rentals", "1466637574441-749b8f19452f"),
    ("Coastal Treasures gift shop in Harbour Town", "1622726196151-bfa9875199b0"),

    # Family Activities
    ("Coastal Discovery Museum at Honey Horn Plantation", "1623902114358-9ee816e91401"),
    ("The Sandbox interactive children's museum", "1503454537195-1dcabb73ffb9"),
    ("Lawton Stables horseback riding in Sea Pines", "1598711033236-3e0b403a14e8"),
    ("Pirate's Island Adventure Golf mini golf course", "1564607890610-2172bf275043"),
    ("Legendary Golf miniature golf course", "1575721087345-4cd6f2a157ca"),
    ("Adventure Cove Caribbean mini golf and arcade", "1511882150382-421056c89033"),
    ("Coligny Beach Park public beach with families", "1507525428034-b723cf961d3e"),
    ("Harbour Town Lighthouse red and white striped tower", "1582517339790-63168430ee86"),
    ("Pinckney Island National Wildlife Refuge salt marsh", "1572715376701-98568319fd0b"),
    ("Family kayak eco tour with Outside Hilton Head", "1572715376701-98568319fd0b"),
]

URL_TEMPLATE = "https://images.unsplash.com/photo-{photo_id}?w=1200&q=80&auto=format&fit=crop"

def main():
    text = DATA_FILE.read_text(encoding="utf-8")
    original = text

    applied = []
    skipped = []

    for alt_substring, photo_id in IMAGE_MAP:
        url = URL_TEMPLATE.format(photo_id=photo_id)
        # Try three quote patterns:
        #   1. single-quoted alt: 'XYZ' (no apostrophes)
        #   2. double-quoted alt: "XYZ" (typically when XYZ contains apostrophes)
        #   3. single-quoted alt: 'XYZ' with escaped apostrophes (\')
        # Match `src: ''` followed by any inline content, then alt: with substring.
        # For substring matching across escaped apostrophes, strip apostrophes first
        # and match around them.
        clean_substr = alt_substring.replace("'", r"[\\']*")
        new_text, count = text, 0

        # Pattern A: single-quoted alt (works for both unescaped and \' escaped if we use clean_substr)
        pattern_a = re.compile(
            r"src: ''[^\n]*\n(\s+)alt: '([^']*"
            + clean_substr
            + r"[^']*)'",
            re.MULTILINE,
        )
        new_text, count = pattern_a.subn(f"src: '{url}',\n\\1alt: '\\2'", text)

        # Pattern B: double-quoted alt
        if count == 0:
            pattern_b = re.compile(
                r"src: ''[^\n]*\n(\s+)alt: \"([^\"]*"
                + re.escape(alt_substring)
                + r"[^\"]*)\"",
                re.MULTILINE,
            )
            new_text, count = pattern_b.subn(f"src: '{url}',\n\\1alt: \"\\2\"", text)
        if count == 0:
            skipped.append(alt_substring)
        elif count > 1:
            print(f"WARN: {count} matches for '{alt_substring}' — fragment not unique", file=sys.stderr)
            applied.append(f"{alt_substring} ({count}x)")
            text = new_text
        else:
            applied.append(alt_substring)
            text = new_text

    if text == original:
        print("No changes made.")
        return 1

    DATA_FILE.write_text(text, encoding="utf-8")
    print(f"Applied {len(applied)} image URLs")
    if skipped:
        print(f"\nSKIPPED ({len(skipped)}): could not find alt substring")
        for s in skipped:
            print(f"  - {s}")
        return 2
    return 0

if __name__ == "__main__":
    sys.exit(main())
