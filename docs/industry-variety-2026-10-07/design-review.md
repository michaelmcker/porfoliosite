# Design review and implementation

## Artwork

The earlier collection repeated an editorial serif headline beside a large photo inside the same laptop. The new collection changes the composition, type family, palette, photography and navigation treatment. The strongest screen designs are presented directly, with natural proportions and softened corners; the plumbing design retains its device presentation. No image captions or qualification labels were added.

| Industry | Visual composition selected |
|---|---|
| Plumbers | Cobalt typographic poster; condensed white headline; yellow action; shallow faucet photograph |
| Electricians | Dark architecture; acid-yellow condensed typography; vertical navigation rail |
| HVAC | Centred coral rounded typography; heat-pump product; cream and sage |
| Roofers | Red vertical masthead; roof panorama; horizontal service/estimate strip |
| Landscapers | Oversized serif masthead; staggered garden diptych; olive and ivory |
| Builders | Full-bleed architectural photography; fine oversized wordmark along lower edge |
| Appliance repair | Cobalt block typography; three colourful appliance product panels |
| Law firms | Centred legal editorial; ivory whitespace; restrained office panorama |
| Accountants | Green typographic masthead; rational service grid; calculator still life |
| Financial advisors | Navy editorial; narrow navigation rail; monochrome lakeshore |
| Real estate | Large condensed wordmark over property photograph; inventory search strip |
| Property management | Orange/black statement typography; angular building mosaic; audience routes |
| Medical practices | Cobalt centred typography; mint opening-hours panel; clinical image; patient routes |
| Dentists | Powder blue and tomato red; rounded display type; interior triptych |
| Physiotherapy | Lime athletic typography; dark equipment photography; diagonal image boundary |
| Med spas | Rose/burgundy beauty editorial; oversized thin serif masthead; central product still life |
| Charities | Yellow/black campaign typography; garden, produce and communal-table collage |
| Schools | Collegiate burgundy and ivory; campus/library prospectus composition |
| Hotels | Immersive lakeside terrace; white centred serif; booking bar |
| Vacation rentals | Burnt-orange slab masthead; outdoor photo collage; handwritten accents |
| Wineries | Plum/cream wine poster; central bottle; vineyard strip |
| Restaurants | Burgundy/yellow condensed masthead; overhead plated food; side menu |
| Retail | Blue Swiss catalogue; three contrasting product panels; category navigation |
| Car dealerships | Graphite/red automotive design; central vehicle profile; inventory filters |

The medical visual was refined to remove a generated California address and use Kelowna & the Okanagan. Asset dimensions are preserved, with responsive WebP versions and reserved image dimensions. The largest primary image is below 265 KB.

## Generated layout references

Three large independent hero references were generated and inspected before implementing the alternate compositions. `layout-references.json` records the originals. The existing approved split hero remains the fourth composition.

- **Editorial:** image left, copy right, roughly 55/45. Serif headline with forest italic emphasis, 40–66 px, large calm white field, gold capsule action, hairline transition into the body. The implemented page uses the selected direct website artwork rather than repeating the laptop frame.
- **Gallery:** top row places a large sans/italic headline left and concise introduction/action right; a single centred image spans the row below. Headline 42–74 px; 34 px row gap; artwork capped at 510 px high on desktop so the whole composition is visible. Gold CTA remains above the image.
- **Care:** centred headline spanning the section, followed by an asymmetric 40/60 introduction and artwork row. Headline 42–72 px; 38 px row gap; strong image with minimal containment. On mobile the heading, explanation, CTA and image follow a simple reading order.

All four use the unchanged shared navigation, DM Sans/Fraunces, white, forest green and gold. Section order also varies: professional pages introduce decision detail earlier, gallery pages bring selected work forward, and care pages introduce the enquiry process earlier. Original industry-specific content, FAQ answers and case-study facts remain intact.

## Responsive inspection

Inspected the collection and all four representative desktop compositions in the browser. Checked all 24 pages at 1440, 768, 390 and 320 px: no horizontal overflow, one H1, six FAQs, and every hero image loaded. Mobile screenshots confirm readable headlines, visible contact actions and full-width artwork without distortion. Existing schema, discovery and internal-link tests pass.
