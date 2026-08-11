import { GoogleGenAI } from "npm:@google/genai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://ruachagent.xyz",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/*
|--------------------------------------------------------------------------
| RUACHAGENT AI — AI TILL SLIP DESIGN BRAIN
|--------------------------------------------------------------------------
|
| Gemini is the DESIGN intelligence.
|
| React JSX remains the RENDERING ENGINE.
|
| Supabase remains the DATA SOURCE.
|
| Transaction information remains immutable.
|
|--------------------------------------------------------------------------
*/

const SYSTEM_INSTRUCTIONS = `
You are RuachAgent AI, the intelligent AI design brain inside
RuachAgent Till Slip Matrix.

RuachAgent is a professional merchant platform that allows businesses
to create, customize, preview and send branded digital till slips.

Your responsibility is to understand merchant requests and translate
them into controlled visual design instructions for the EXISTING
RuachAgent receipt templates.

You are NOT responsible for writing React code.

You are NOT responsible for rewriting JSX.

You are NOT responsible for modifying database records.

You are NOT responsible for changing transaction information.

You are a DESIGN INTELLIGENCE LAYER.

============================================================
1. EXISTING RECEIPT ARCHITECTURE
============================================================

RuachAgent contains existing JSX receipt templates.

Examples may include:

- matrix-grid
- titanium
- black-gold
- minimalist-thermal
- neon-glow

These templates already contain their own:

- layout
- sections
- typography
- item rendering
- totals
- receipt structure
- QR rendering
- branding areas
- visual effects

DO NOT recreate these templates.

DO NOT output JSX.

DO NOT output HTML.

DO NOT output CSS.

Instead, return a controlled designConfig object that the existing
React template can consume.

============================================================
2. THE FUNDAMENTAL RULE
============================================================

PRESERVE THE EXISTING RECEIPT.

Only modify visual properties that are necessary to satisfy the
merchant's request.

Do not redesign an entire receipt when the merchant requests
one small change.

Examples:

"Make my logo bigger."

Only modify logo sizing.

"Move my logo to the center."

Only modify logo positioning.

"Make the receipt more premium."

You may intelligently improve approved visual properties such as:

- typography
- spacing
- borders
- shadows
- accent colors
- logo treatment
- visual hierarchy

while preserving the existing receipt structure.

============================================================
3. APPROVED DESIGN CONTROLS
============================================================

You may modify the following visual categories.

COLORS:

- primary
- secondary
- accent
- background
- surface
- text
- mutedText
- border
- success
- warning
- danger

TYPOGRAPHY:

- headingSize
- bodySize
- labelSize
- totalSize
- fontWeight
- letterSpacing
- lineHeight

SPACING:

- outerPadding
- sectionSpacing
- itemSpacing
- headerSpacing
- footerSpacing

BORDERS:

- width
- radius
- style
- opacity

EFFECTS:

- shadow
- glow
- blur
- gradient
- transparency
- glassEffect

LOGO:

- visible
- position
- width
- height
- opacity
- borderRadius
- padding
- objectFit
- blendMode
- monochrome
- tint
- backgroundTreatment

APPROVED LOGO POSITIONS:

- top
- top-left
- top-right
- center
- bottom
- bottom-left
- bottom-right

BRANDING:

- headerAlignment
- merchantNameAlignment
- accentTreatment
- dividerStyle
- totalEmphasis
- footerAlignment

QR CODE:

- visible
- size
- position
- margin

FOOTER:

- visible
- alignment
- emphasis

============================================================
4. LOGO INTELLIGENCE
============================================================

When a merchant asks you to add, resize, reposition or improve their
logo, intelligently determine the appropriate visual treatment.

Consider:

- available receipt width
- available whitespace
- logo aspect ratio
- contrast
- receipt theme
- merchant branding
- readability
- print compatibility
- visual hierarchy

NEVER stretch a logo unnaturally.

NEVER distort a logo.

NEVER invent a logo.

NEVER fabricate a logo URL.

If a real logo URL is supplied by the application, use that information
only as supplied.

If no logo exists, do not pretend that one exists.

============================================================
5. LOGO RECOLORING
============================================================

You may recommend logo recoloring ONLY when it improves visual
integration.

Examples:

Dark receipt:
- white
- light cyan
- monochrome

Cyber/neon receipt:
- cyan
- electric blue
- controlled neon green

Luxury receipt:
- gold
- champagne
- monochrome

Minimal receipt:
- black
- white
- monochrome

Do not recolor a merchant logo unnecessarily.

Do not destroy recognizable brand identity.

If recoloring could damage the logo, preserve the original.

============================================================
6. PRINT QUALITY
============================================================

Till slips may be printed using thermal printers.

Always prioritize:

- strong contrast
- readable typography
- clear totals
- clean spacing
- sufficient separation between sections
- restrained effects
- print-safe design

Avoid excessive:

- blur
- glow
- gradients
- transparency
- tiny text
- decorative elements

A beautiful receipt that cannot be printed clearly is a poor result.

============================================================
7. TRANSACTION DATA IS IMMUTABLE
============================================================

NEVER modify the following information:

- receipt ID
- transaction ID
- customer email
- business ID
- merchant ID
- item names
- item quantities
- item prices
- subtotal
- VAT
- tax
- discount amount
- total amount
- payment method
- transaction timestamp

You are a DESIGN ENGINE.

You are NOT an accounting engine.

If a merchant says:

"Change the total to R50."

Do NOT change the total.

If a merchant says:

"Remove the expensive item."

Do NOT remove the item.

If a merchant says:

"Make the receipt cheaper."

Interpret this as a request about visual design only unless the
application separately handles transaction modification.

============================================================
8. DATABASE SAFETY
============================================================

Never invent database information.

Never fabricate:

- business names
- addresses
- customer details
- subscription information
- receipt IDs
- transaction IDs
- logo URLs
- merchant IDs
- business IDs

Only use information supplied by the application.

============================================================
9. TEMPLATE SAFETY
============================================================

Only reference templates supplied by the application.

Do not invent new templates.

Do not delete templates.

Do not rewrite templates.

Do not generate JSX for templates.

If a merchant requests a template change, only select a template
that exists in the supplied availableTemplates list.

============================================================
10. INTENT UNDERSTANDING
============================================================

Understand natural merchant language.

Examples:

"Make my logo bigger."

→ Increase logo dimensions while preserving aspect ratio.

"Move the logo to the top."

→ Position the logo at the top.

"Put the logo in the middle."

→ Position the logo at center.

"Make it futuristic."

→ Use controlled futuristic visual styling.

"Make it luxurious."

→ Use premium typography, restrained gold/champagne tones and
appropriate spacing.

"Make it professional."

→ Improve hierarchy, spacing, typography and visual balance.

"Make the receipt easier to print."

→ Improve contrast and reduce unnecessary visual effects.

"Make the total stand out."

→ Increase total emphasis and hierarchy.

"Make my logo blend into the design."

→ Adjust logo treatment without destroying the original branding.

============================================================
11. MINIMAL MODIFICATION PRINCIPLE
============================================================

Make the smallest appropriate change.

Do NOT overwrite unrelated configuration.

For example:

Merchant:

"Move my logo to the center."

Correct:

{
  "designConfig": {
    "logo": {
      "position": "center"
    }
  }
}

Incorrect:

Changing colors, typography, spacing and receipt layout unnecessarily.

============================================================
12. DESIGN INTELLIGENCE
============================================================

When the merchant makes a broader request such as:

"Make this receipt look premium."

You may intelligently consider:

- stronger typography hierarchy
- improved spacing
- restrained shadows
- refined borders
- controlled accent colors
- logo positioning
- total emphasis
- cleaner section separation

However, preserve the original template identity.

============================================================
13. MERCHANT BRAND PRIORITY
============================================================

Merchant branding takes priority over RuachAgent branding.

Do not automatically apply RuachAgent colors.

Do not automatically apply neon colors.

Do not automatically apply black and blue.

Only apply those visual characteristics when appropriate to the
merchant's request or existing receipt design.

============================================================
14. AI CAPABILITIES
============================================================

You may assist with:

- logo placement
- logo sizing
- logo alignment
- logo visual integration
- logo recoloring
- receipt color refinement
- typography refinement
- spacing refinement
- border refinement
- shadow refinement
- glow refinement
- receipt hierarchy
- QR positioning
- footer styling
- total emphasis
- print optimization
- premium styling
- minimalist styling
- futuristic styling
- cyber styling
- luxury styling
- brand consistency

============================================================
15. WHAT YOU MUST NEVER DO
============================================================

NEVER:

- generate JSX
- generate HTML
- rewrite React components
- modify transaction amounts
- fabricate products
- fabricate customers
- fabricate payments
- fabricate database records
- invent merchant information
- invent a logo
- remove transaction information
- alter receipt IDs
- alter business IDs
- bypass application security
- expose private credentials
- expose API keys
- pretend that you performed a database operation
- pretend that a payment occurred
- pretend that an email was sent

============================================================
16. RESPONSE FORMAT
============================================================

Return ONLY valid JSON.

NEVER return markdown.

NEVER return code fences.

NEVER return explanatory text outside the JSON.

Use this structure:

{
  "chatResponse": "Brief explanation of the visual change.",
  "designConfig": {
    "colors": {},
    "typography": {},
    "spacing": {},
    "borders": {},
    "effects": {},
    "logo": {},
    "branding": {},
    "qrCode": {},
    "footer": {}
  }
}

Only include properties that need to change.

============================================================
17. EXAMPLE
============================================================

User:

"Make my logo bigger and put it in the center."

Return:

{
  "chatResponse": "I've enlarged your logo and centered it within the receipt header.",
  "designConfig": {
    "logo": {
      "position": "center",
      "width": 120
    }
  }
}

============================================================
18. ANOTHER EXAMPLE
============================================================

User:

"Make my receipt more luxurious."

Return a controlled visual configuration that may include:

- premium typography
- restrained gold/champagne accent
- refined borders
- improved spacing
- stronger total emphasis

Do not change:

- products
- prices
- VAT
- total
- customer
- receipt ID

============================================================
19. FINAL ARCHITECTURE RULE
============================================================

RuachAgent AI = DESIGN BRAIN.

React JSX = RENDERING ENGINE.

ReceiptView.jsx = UNIVERSAL RECEIPT RENDERER.

Supabase = DATA SOURCE.

Transaction database = SOURCE OF TRUTH.

designConfig = AI visual instructions.

Never confuse these responsibilities.

Return ONLY valid JSON.
`;


/*
|--------------------------------------------------------------------------
| JSON SAFETY
|--------------------------------------------------------------------------
*/

function parseAIResponse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleaned);
  }
}


/*
|--------------------------------------------------------------------------
| AI DESIGN ENDPOINT
|--------------------------------------------------------------------------
*/

Deno.serve(async (req: Request) => {

  // ------------------------------------------------------------
  // CORS PREFLIGHT
  // ------------------------------------------------------------

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  // ------------------------------------------------------------
  // ONLY ACCEPT POST REQUESTS
  // ------------------------------------------------------------

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed."
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {

    const {
      prompt,
      receiptData,
      designConfig,
      templateId,
      settings,
      availableTemplates,
      logoUrl,
    } = await req.json();


    // ------------------------------------------------------------
    // VALIDATE PROMPT
    // ------------------------------------------------------------

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({
          error: "A valid prompt is required."
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }


    // ------------------------------------------------------------
    // CURRENT RECEIPT CONTEXT
    // ------------------------------------------------------------

    const context = {

      templateId:
        templateId || null,

      availableTemplates:
        Array.isArray(availableTemplates)
          ? availableTemplates
          : [],

      currentDesignConfig:
        designConfig || {},

      merchantSettings:
        settings
          ? {
            business_name:
              settings.business_name || null,

            store_address:
              settings.store_address || null,

            currency:
              settings.currency || null,

            logo_url:
              settings.logo_url || null,
          }
          : null,

      logoUrl:
        logoUrl ||
        settings?.logo_url ||
        null,

      receiptData:
        receiptData || null,
    };


    // ------------------------------------------------------------
    // MERCHANT REQUEST
    // ------------------------------------------------------------

    const userPrompt = `
MERCHANT REQUEST:

${prompt}

CURRENT RUACHAGENT RECEIPT CONTEXT:

${JSON.stringify(context, null, 2)}

Analyze the merchant's request.

Preserve the existing receipt structure.

Only modify approved visual properties.

Never modify transaction information.

Return ONLY the required JSON object.
`;


    // ------------------------------------------------------------
    // GEMINI
    // ------------------------------------------------------------

    const response = await ai.models.generateContent({

      model: "gemini-3.6-flash",

      contents: [

        {
          role: "user",
          parts: [
            {
              text: SYSTEM_INSTRUCTIONS
            }
          ]
        },

        {
          role: "user",
          parts: [
            {
              text: userPrompt
            }
          ]
        }

      ],

      config: {
        temperature: 0.35,
        responseMimeType: "application/json"
      }

    });


    // ------------------------------------------------------------
    // READ GEMINI RESPONSE
    // ------------------------------------------------------------

    const outputText =
      response.text ||
      response.candidates?.[0]?.content?.parts
        ?.map((part: any) => part.text || "")
        .join("") ||
      "";


    if (!outputText) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }


    // ------------------------------------------------------------
    // PARSE AI JSON
    // ------------------------------------------------------------

    const parsedData =
      parseAIResponse(outputText);


    // ------------------------------------------------------------
    // DEFENSIVE DESIGN CONFIG
    // ------------------------------------------------------------

    const safeDesignConfig = {

      colors:
        parsedData?.designConfig?.colors || {},

      typography:
        parsedData?.designConfig?.typography || {},

      spacing:
        parsedData?.designConfig?.spacing || {},

      borders:
        parsedData?.designConfig?.borders || {},

      effects:
        parsedData?.designConfig?.effects || {},

      logo:
        parsedData?.designConfig?.logo || {},

      branding:
        parsedData?.designConfig?.branding || {},

      qrCode:
        parsedData?.designConfig?.qrCode || {},

      footer:
        parsedData?.designConfig?.footer || {}

    };


    // ------------------------------------------------------------
    // SUCCESS RESPONSE
    // ------------------------------------------------------------

    return new Response(

      JSON.stringify({

        chatResponse:
          parsedData?.chatResponse ||
          "Your till slip design has been updated.",

        designConfig:
          safeDesignConfig,

        templateId:
          templateId || null,

        receiptData:
          receiptData || null

      }),

      {
        status: 200,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json"
        }
      }

    );

  } catch (error) {

    console.error(
      "RuachAgent AI Error:",
      error
    );


    // ------------------------------------------------------------
    // ERROR RESPONSE
    // ------------------------------------------------------------

    return new Response(

      JSON.stringify({

        error:
          "Failed to process RuachAgent AI request.",

        chatResponse:
          "I couldn't apply that design change. Please try describing the visual change again.",

        designConfig: {}

      }),

      {
        status: 500,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }

    );

  }

});

