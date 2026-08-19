/* =============================================================================
   BILL OF LADING — definición actual del documento, lista para el playground
   -----------------------------------------------------------------------------
   Extraído de: kargoru-web
     apps/kargoru-web/src/app/dashboard/shipment/generic-shipment-detail/
     dialog-form-quote-request/dialog-form-quote-request.component.ts
     (función buildBillOfLadingPdf, líneas 1211–2246)

   CÓMO USARLO
     1. Abre https://pdfmake.github.io/docs/playground.html
     2. Borra todo lo que trae y pega este archivo completo.
     3. El PDF se ve a la derecha, y se actualiza mientras editas.

   CAMBIOS DE ESTA VERSIÓN:
     · Se mantiene Roboto para el Playground.
     · Se quitaron anotaciones TypeScript que el Playground no entiende.
     · Se agregaron controles de salto de página.
     · Las filas logísticas se manejan como bloques independientes.
     · La descripción de carga no tiene límite de caracteres.
     · Las descripciones muy largas se dividen en filas de continuación.
     · La tabla de contenedores utiliza dontBreakRows.
     · El encabezado de la tabla se repite cuando continúa.
============================================================================= */

// ————————————————————— DATOS DE LA OPERACIÓN (inventados) —————————————————————
var SHIPMENT_EJEMPLO = {
  remitent: {
    companyName: "COMERCIALIZADORA QA CEROAUNO S.A.S.",
    taxId: "901999777-1",
    address: "Cra 16A #78-55 Ofc. 305",
    city: "Bogotá",
    country: "Colombia",
    contactName: "Área de Comercio Exterior",
    contactPhone: "+57 601 000 0000",
  },
  destinatary: {
    companyName: "SOUTHERN TRADE PARTNERS LLC",
    taxId: "EIN 00-0000000",
    address: "1200 NW 78th Ave, Suite 210",
    city: "Miami, FL 33126",
    country: "United States",
    contactName: "Import Desk",
    contactPhone: "+1 305 000 0000",
  },
};

// ——————————————————— LO QUE EL OPERATIVO DIGITA EN EL FORMULARIO ———————————————
var formData = {
  idioma: "es",
  tipoCopia: "ORIGINAL",
  bookingNo: "BKG-2026-004871",
  blNo: "KGR-CTG-0004871",
  originalsBL: "3",

  preCarriageBy: "CONALCA S.A.S.",
  placeOfReceipt: "Bogotá, Colombia",
  vesselVoyageFlag: "MSC ISABELLA / 428W / PANAMA",
  portOfLoading: "Cartagena, Colombia",
  etdLoading: "2026-08-18",
  portOfDischarge: "Port Everglades, United States",
  placeOfDelivery: "Miami, FL, United States",
  typeOfMovement: "FCL/FCL",

  issueDate: "2026-08-14",
  issuePlace: "Bogotá, Colombia",

  correoShipper: "comercioexterior@qa-ceroauno.example",
  correoConsignee: "importdesk@southerntrade.example",

  notifyName: "SAME AS CONSIGNEE",
  notifyNit: "",
  notifyAddress: "",
  notifyPhone: "",
  notifyEmail: "",

  containersData: [
    {
      containerNumber: "MSCU4471029",
      seal: "CO8842197",
      packages: "1.120 CAJAS",
      description:
        "CAFÉ VERDE EN GRANO, EXCELSO UGQ.\nPARTIDA ARANCELARIA: 0901.11.10.00",
      grossWeight: "19.840,00 KGS",
      measurement: "28,500 M3",
    },
    {
      containerNumber: "TGHU7719004",
      seal: "CO8842198",
      packages: "860 BULTOS",
      description:
        "PLÁTANO HARTÓN VERDE FRESCO PARA EXPORTACIÓN, CALIBRE 39-49, EMPACADO EN CAJA DE CARTÓN CORRUGADO DE 22 KG NETO CON BOLSA DE POLIETILENO PERFORADA Y ABSORBENTE DE ETILENO, PALETIZADO EN ESTIBA DE MADERA TRATADA NIMF-15 CON ESQUINEROS Y ZUNCHO PLÁSTICO, TEMPERATURA DE TRANSPORTE 13,3 °C, VENTILACIÓN 25 M3/H, ATMÓSFERA CONTROLADA NO APLICA.\nPARTIDA ARANCELARIA: 0803.10.10.00",
      grossWeight: "18.920,00 KGS",
      measurement: "27,100 M3",
    },
    {
      containerNumber: "CAIU9930517",
      seal: "CO8842199",
      packages: "640 CAJAS",
      description:
        "AGUACATE HASS FRESCO.\nPARTIDA ARANCELARIA: 0804.40.00.00",
      grossWeight: "17.400,00 KGS",
      measurement: "26,800 M3",
    },
  ],
};

// ═════════════════════ DE AQUÍ PARA ABAJO ES EL CÓDIGO REAL ═════════════════════
var shipment = SHIPMENT_EJEMPLO;

const idioma = formData.idioma || "es";

// — LOGO SVG KARGORU —
const KARGORU_SVG = `<svg viewBox="0 0 70 45" xmlns="http://www.w3.org/2000/svg">
<path d="M54.0144 5.66563C54.0144 5.66563 55.0359 2.95666 55.1955 0H54.9082C54.9082 0 52.3703 12.1672 38.5156 9.33437C38.5156 9.33437 31.3488 5.04644 23.8148 10.3715C16.2809 15.7121 13.328 18.7926 0 15.2786C0 15.2786 9.68875 23.3746 22.8731 18.1579C22.8731 18.1579 25.8101 19.6594 26.3687 25.7585C26.9274 31.8576 25.6026 34.226 26.672 37.4149C27.7414 40.6037 29.6728 43.3437 32.1947 45.0155H33.8228C33.8228 45.0155 28.4278 39.7368 30.2634 33.3127C30.2634 33.3127 34.7167 28.2043 34.3655 20.5728C34.3655 20.5728 35.004 20.5263 36.0415 20.3406V27.322H44.8683V18.7307H41.5004C45.0758 17.291 49.2099 14.7368 51.8915 10.2322C51.8915 10.2322 55.834 12.4458 59.984 11.4706C60 11.4706 56.5523 10.0464 54.0144 5.66563Z" fill="#2D9ACF"/>
</svg>`;

// — TRADUCCIONES —
const t =
  idioma === "en"
    ? {
        billOfLading: "BILL OF LADING",
        shipperExporter: "SHIPPER/EXPORTER (Complete Name and Address)",
        bookingNo: "BOOKING No.",
        blNo: "BILL OF LADING No.",
        consignee: "CONSIGNEE (Complete Name and Address)",
        notifyParty: "Notify Party (Complete Name and Address)",
        receivedText:
          "RECEIVED by the CARRIER from the MERCHANT in apparent good order and condition unless otherwise indicate. The goods mentioned above to be carried by the VESSEL. Subject to this BILL OF LADING, from the place of receipt or the port of Loading to the port of Discharge or Place of Delivery shown above. If the goods are shipped by MERCHANT in container or PACKAGE, then this BILL OF LADING is a receipt only for the CONTAINER or PACKAGE and any statements made by the CARRIER in this BILL OF LADING as to the number, good order and condition of the GOODS shall apply to the number of such CONTAINERS of PACKAGES and their condition.",
        preCarriageBy: "PRE CARRIAGE BY",
        placeOfReceipt: "PLACE OF RECEIPT BY PARTICIPATING CARRIER",
        vesselVoyageFlag: "VESSEL/VOYAGE/FLAG",
        portOfLoading: "PORT OF LOADING",
        etdLoading: "ETD at Loading Port",
        originalsBL: "NO. OF ORIGINAL B(s)/L issued",
        portOfDischarge: "PORT OF DISCHARGE",
        placeOfDelivery: "PLACE OF DELIVERY BY PARTICIPATING CARRIER",
        typeOfMovement:
          "Type of Movement (If mixed, use description of packages and goods field)",
        particulars: "PARTICULARS FURNISHED BY SHIPPER",
        marksNos: "MARKS & NOS/CONTAINER NOS",
        noPkgs: "NO. OF PKGS",
        descriptionGoods: "DESCRIPTION OF PACKAGES AND GOODS",
        grossWeight: "GROSS WEIGHT (KG)",
        measurement: "MEASUREMENT (M3)",
        dateAndPlace: "Date and Place of Issue:",
        by: "By: KARGORU SAS",
        documento: "DOCUMENT",
        docGenerado: "Automatically generated document",
        contractTitle: "TERMS AND CONDITIONS",
        contractSubtitle:
          "This page is reserved for the standard contract text. Replace it with the final terms and conditions document.",
        contractBody:
          "The terms and conditions of carriage, liability, and other contractual clauses applicable to this Bill of Lading will be included here once the final contract document is available. This placeholder should be replaced by the official contract text provided by KARGORU.",
      }
    : {
        billOfLading: "BILL OF LADING",
        shipperExporter: "SHIPPER/EXPORTER (Nombre y Dirección Completos)",
        bookingNo: "BOOKING No.",
        blNo: "BILL OF LADING No.",
        consignee: "CONSIGNEE (Nombre y Dirección Completos)",
        notifyParty: "Notify Party (Nombre y Dirección Completos)",
        receivedText:
          "RECIBIDO por el TRANSPORTADOR del COMERCIANTE en aparente buen orden y condición salvo que se indique lo contrario. La mercancía mencionada anteriormente será transportada por el BUQUE. Sujeto a este BILL OF LADING, desde el lugar de recepción o el puerto de carga hasta el puerto de descarga o lugar de entrega indicado anteriormente. Si la mercancía es enviada por el COMERCIANTE en contenedor o EMPAQUE, entonces este BILL OF LADING es un recibo únicamente para el CONTENEDOR o EMPAQUE y cualquier declaración hecha por el TRANSPORTADOR en este BILL OF LADING en cuanto al número, buen orden y condición de la MERCANCÍA aplicará al número de dichos CONTENEDORES o EMPAQUES y su condición.",
        preCarriageBy: "PRE CARRIAGE BY",
        placeOfReceipt: "PLACE OF RECEIPT BY PARTICIPATING CARRIER",
        vesselVoyageFlag: "VESSEL/VOYAGE/FLAG",
        portOfLoading: "PORT OF LOADING",
        etdLoading: "ETD at Loading Port",
        originalsBL: "NO. OF ORIGINAL B(s)/L issued",
        portOfDischarge: "PORT OF DISCHARGE",
        placeOfDelivery: "PLACE OF DELIVERY BY PARTICIPATING CARRIER",
        typeOfMovement:
          "Type of Movement (If mixed, use description of packages and goods field)",
        particulars: "PARTICULARS FURNISHED BY SHIPPER",
        marksNos: "MARKS & NOS/CONTAINER NOS",
        noPkgs: "NO. OF PKGS",
        descriptionGoods: "DESCRIPTION OF PACKAGES AND GOODS",
        grossWeight: "GROSS WEIGHT (KG)",
        measurement: "MEASUREMENT (M3)",
        dateAndPlace: "Date and Place of Issue:",
        by: "By: KARGORU SAS",
        documento: "DOCUMENTO",
        docGenerado: "Documento generado automáticamente",
        contractTitle: "TÉRMINOS Y CONDICIONES",
        contractSubtitle:
          "Esta página está reservada para el texto del contrato estándar. Reemplazarla con el documento final de términos y condiciones.",
        contractBody:
          "Los términos y condiciones de transporte, responsabilidad y demás cláusulas contractuales aplicables a este Bill of Lading se incluirán aquí cuando el documento final del contrato esté disponible. Este texto es un marcador de posición y debe remplazarse por el contrato oficial proporcionado por KARGORU.",
      };

// — DATOS DEL SHIPPER —
const shipperName =
  shipment?.remitent?.companyName ||
  shipment?.remitent?.contactName ||
  "N/A";
const shipperAddress = shipment?.remitent?.address || "";
const shipperCity = shipment?.remitent?.city || "";
const shipperCountry = shipment?.remitent?.country || "";
const shipperPhone = shipment?.remitent?.contactPhone || "";
const shipperTaxId = shipment?.remitent?.taxId || "";
const correoShipper = formData.correoShipper || "";

const shipperFullText = [
  shipperName,
  shipperTaxId ? `NIT: ${shipperTaxId}` : "",
  shipperAddress,
  [shipperCity, shipperCountry].filter(Boolean).join(", "),
  shipperPhone,
  correoShipper,
]
  .filter(Boolean)
  .join("\n");

// — DATOS DEL CONSIGNEE —
const consigneeName =
  shipment?.destinatary?.companyName ||
  shipment?.destinatary?.contactName ||
  "N/A";
const consigneeAddress = shipment?.destinatary?.address || "";
const consigneeCity = shipment?.destinatary?.city || "";
const consigneeCountry = shipment?.destinatary?.country || "";
const consigneePhone = shipment?.destinatary?.contactPhone || "";
const consigneeTaxId = shipment?.destinatary?.taxId || "";
const correoConsignee = formData.correoConsignee || "";

const consigneeFullText = [
  consigneeName,
  consigneeTaxId ? `NIT: ${consigneeTaxId}` : "",
  consigneeAddress,
  [consigneeCity, consigneeCountry].filter(Boolean).join(", "),
  consigneePhone,
  correoConsignee,
]
  .filter(Boolean)
  .join("\n");

// — DATOS MANUALES —
const bookingNo = formData.bookingNo || "";
const blNo = formData.blNo || "";
const tipoCopia = formData.tipoCopia || "ORIGINAL";

const notifyName = formData.notifyName || "";
const notifyNit = formData.notifyNit || "";
const notifyAddress = formData.notifyAddress || "";
const notifyPhone = formData.notifyPhone || "";
const notifyEmail = formData.notifyEmail || "";

const notifyFullText = [
  notifyName,
  notifyNit ? `NIT: ${notifyNit}` : "",
  notifyAddress,
  notifyPhone,
  notifyEmail,
]
  .filter(Boolean)
  .join("\n");

const preCarriageBy = formData.preCarriageBy || "";
const placeOfReceipt = formData.placeOfReceipt || "";
const vesselVoyageFlag = formData.vesselVoyageFlag || "";
const portOfLoading = formData.portOfLoading || "";
const etdLoading = formData.etdLoading || "";
const originalsBL = formData.originalsBL || "";
const portOfDischarge = formData.portOfDischarge || "";
const placeOfDelivery = formData.placeOfDelivery || "";
const typeOfMovement = formData.typeOfMovement || "FCL/FCL";

const issueDate = formData.issueDate || "";
const issuePlace = formData.issuePlace || "";

const containersData = formData.containersData || [];
const MAX_CONTAINERS_FIRST_PAGE = 10;

const fechaEmision = new Date().toLocaleDateString("es-CO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

// — DATOS DEL FORWARDER —
const forwarderNit = "NIT. 901.283.886-0";
const forwarderAddress = "Cra 16A Ofc 30578-55";
const forwarderCity = "Bogotá, Colombia";
const forwarderFullAddress =
  "Cra 16A #78-55 OFC. 305, Bogotá, Colombia";

// — COLORES —
const DARK = "#1a2744";
const BLUE = "#2D9ACF";
const LIGHT = "#f4f7fb";
const GRAY = "#8a9bb5";
const WHITE = "#ffffff";
const BORDER = "#e2e8f0";

const sectionHeader = (text, alignment = "left") => ({
  table: {
    widths: ["*"],
    body: [
      [
        {
          text,
          fontSize: 7,
          bold: true,
          color: WHITE,
          fillColor: DARK,
          alignment,
          border: [false, false, false, false],
          margin: [4, 0, 4, 0],
        },
      ],
    ],
  },
  layout: "noBorders",
  margin: [0, 0, 0, 1],
});

const cellBorder = [true, true, true, true];
const borderColorArr = [BORDER, BORDER, BORDER, BORDER];

// Recuadro superior independiente: cambia solo relativePosition para moverlo.
const copyBadge = {
  stack: [
    {
      canvas: [
        {
          type: "rect",
          x: 0,
          y: 0,
          w: 155,
          h: 18,
          color: BLUE,
        },
      ],
      width: 155,
      height: 18,
    },
    {
      text: `${tipoCopia} · ${blNo}`,
      fontSize: 9,
      bold: true,
      color: WHITE,
      alignment: "center",
      margin: [0, -14, 0, 0],
    },
  ],
  width: 155,
  height: 18,
  relativePosition: { x: 0, y: -25 },
};

// La descripción NO tiene límite de caracteres.
// El tamaño se mantiene estable; pdfmake se encarga del wrapping.
const DESCRIPTION_FONT_SIZE = 6.8;

// Para descripciones excepcionalmente largas se crean filas de continuación.
// No limita la cantidad de caracteres: solo evita que una única fila
// llegue a ser más alta que una página completa.
const splitDescriptionForPagination = (description = "") => {
  const text = String(description || "").trim();
  if (!text) return [""];

  const words = text.split(/(\s+)/);
  const chunks = [];
  let current = "";

  const maxCharsPerLine = 78;
  const maxLinesPerRow = 22;

  for (const token of words) {
    const candidate = current + token;

    const estimatedLines = candidate.split("\n").reduce(
      (sum, part) =>
        sum + Math.max(1, Math.ceil(part.length / maxCharsPerLine)),
      0
    );

    if (current && estimatedLines > maxLinesPerRow) {
      chunks.push(current.trim());
      current = token;
    } else {
      current = candidate;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.length ? chunks : [text];
};

const makeContainerCell = (text, options = {}) => ({
  text: text || "",
  fontSize: options.fontSize || 6.8,
  lineHeight: options.lineHeight || 1,
  color: DARK,
  border: cellBorder,
  borderColor: borderColorArr,
  margin: [1, 1, 1, 1],
  ...(options.alignment ? { alignment: options.alignment } : {}),
});

// — FILAS DE LA TABLA DE CONTENEDORES —
// Una descripción larga puede generar varias filas de continuación.
// Así la carga puede crecer a tantas páginas como sea necesario.
const containerRows = containersData.flatMap((c) => {
  const descriptionChunks = splitDescriptionForPagination(
    c.description || ""
  );

  return descriptionChunks.map((descriptionChunk, index) => [
    makeContainerCell(
      index === 0
        ? `${c.containerNumber || ""}${
            c.seal ? "\nSEAL: " + c.seal : ""
          }`
        : "",
      { fontSize: 6.8 }
    ),

    makeContainerCell(
      index === 0 ? c.packages || "" : "",
      {
        fontSize: 6.8,
        alignment: "center",
      }
    ),

    makeContainerCell(descriptionChunk, {
      fontSize: DESCRIPTION_FONT_SIZE,
      lineHeight: 1.1,
    }),

    makeContainerCell(
      index === 0 ? c.grossWeight || "" : "",
      {
        fontSize: 6.8,
        alignment: "center",
      }
    ),

    makeContainerCell(
      index === 0 ? c.measurement || "" : "",
      {
        fontSize: 6.8,
        alignment: "center",
      }
    ),
  ]);
});

// — TOTALES DE CARGA —
const totalWeight = containersData.reduce((total, c) => {
  const weight = Number(
    String(c.grossWeight || "")
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );

  return total + (isNaN(weight) ? 0 : weight);
}, 0);

const totalMeasurement = containersData.reduce((total, c) => {
  const volume = Number(
    String(c.measurement || "")
      .replace(/[^\d,.-]/g, "")
      .replace(",", ".")
  );

  return total + (isNaN(volume) ? 0 : Math.round(volume * 1000));
}, 0);

const totalMeasurementRounded = totalMeasurement / 1000;

const totalPackages = containersData.reduce((total, c) => {
  const packages = Number(
    String(c.packages || "").replace(/[^\d]/g, "")
  );

  return total + (isNaN(packages) ? 0 : packages);
}, 0);

const totalsRow = [
  {
    text: "TOTAL",
    bold: true,
    fontSize: 8.5,
    color: DARK,
    fillColor: LIGHT,
    alignment: "center",
    border: cellBorder,
    borderColor: borderColorArr,
    margin: [2, 2, 2, 2],
  },
  {
    text: `${totalPackages.toLocaleString("es-CO")} UNIDADES`,
    bold: true,
    fontSize: 9,
    color: DARK,
    fillColor: LIGHT,
    alignment: "center",
    border: cellBorder,
    borderColor: borderColorArr,
    margin: [2, 2, 2, 2],
  },
  {
    text: "TOTAL CARGA",
    bold: true,
    fontSize: 9,
    color: DARK,
    fillColor: LIGHT,
    alignment: "center",
    border: cellBorder,
    borderColor: borderColorArr,
    margin: [2, 2, 2, 2],
  },
  {
    text: `${totalWeight.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
    })} KGS`,
    bold: true,
    fontSize: 9,
    color: DARK,
    fillColor: LIGHT,
    alignment: "center",
    border: cellBorder,
    borderColor: borderColorArr,
    margin: [2, 2, 2, 2],
  },
  {
    text: `${totalMeasurementRounded.toLocaleString("es-CO", {
      minimumFractionDigits: 3,
    })} M3`,
    bold: true,
    fontSize: 9,
    color: DARK,
    fillColor: LIGHT,
    alignment: "center",
    border: cellBorder,
    borderColor: borderColorArr,
    margin: [2, 2, 2, 2],
  },
];

const tableBodyRows =
  containerRows.length > 0
    ? containerRows
    : [
        [
          {
            text: "",
            border: cellBorder,
            borderColor: borderColorArr,
            margin: [3, 3, 3, 3],
          },
          {
            text: "",
            border: cellBorder,
            borderColor: borderColorArr,
            margin: [3, 3, 3, 3],
          },
          {
            text: "",
            border: cellBorder,
            borderColor: borderColorArr,
            margin: [3, 3, 3, 3],
          },
          {
            text: "",
            border: cellBorder,
            borderColor: borderColorArr,
            margin: [3, 3, 3, 3],
          },
          {
            text: "",
            border: cellBorder,
            borderColor: borderColorArr,
            margin: [3, 3, 3, 3],
          },
        ],
      ];

var pdfDefinition = {
  pageSize: "LETTER",
  pageOrientation: "landscape",

  pageMargins: [0, 0, 0, 0],

  defaultStyle: {
    font: "Roboto",
  },

  content: [
    // — HEADER —
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              fillColor: DARK,
              border: [false, false, false, false],
              columns: [
                {
                  width: "50%",
                  stack: [
                    {
                      svg: KARGORU_SVG,
                      width: 60,
                      alignment: "left",
                      margin: [24, 0, 0, 0],
                    },
                    {
                      text: "KARGORU SAS",
                      fontSize: 16,
                      bold: true,
                      color: WHITE,
                      margin: [15, -1, 0, 0],
                    },
                    {
                      text: "Simplificamos la logística",
                      fontSize: 8,
                      color: "#9fb8d4",
                      margin: [24, 0, 0, 1],
                    },
                  ],
                },
                {
                  width: "50%",
                  stack: [
                    {
                      text: t.documento,
                      fontSize: 8,
                      color: "#9fb8d4",
                      margin: [0, 8, 16, 0],
                      alignment: "right",
                    },
                    {
                      text: t.billOfLading,
                      fontSize: 14,
                      bold: true,
                      color: WHITE,
                      margin: [0, 0, 16, 1],
                      alignment: "right",
                    },
                  ],
                },
              ],
            },
          ],
          [
            {
              fillColor: DARK,
              border: [false, false, false, false],
              columns: [
                { width: "*", text: "" },
                copyBadge,
                { width: "*", text: "" },
              ],
            },
          ],
        ],
      },
      layout: "noBorders",
    },

    // — BARRA AZUL —
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: "",
              border: [false, false, false, false],
              fillColor: BLUE,
              margin: [0, 1, 0, 1],
            },
          ],
        ],
      },
      layout: "noBorders",
    },

    // — BODY —
    {
      margin: [3, 2, 3, 0],
      stack: [
        // FILA 1: SHIPPER / BOOKING-BL
        {
          table: {
            widths: ["50%", "25%", "25%"],
            body: [
              [
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    sectionHeader(t.shipperExporter),
                    {
                      text: shipperFullText,
                      fontSize: 7.2,
                      color: DARK,
                      margin: [4, 0, 4, 3],
                      lineHeight: 1,
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    sectionHeader(t.bookingNo),
                    {
                      text: bookingNo,
                      fontSize: 11,
                      bold: true,
                      color: DARK,
                      margin: [4, 0, 4, 2],
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    sectionHeader(t.blNo),
                    {
                      text: blNo,
                      fontSize: 13,
                      bold: true,
                      color: DARK,
                      margin: [6, 0, 6, 4],
                    },
                  ],
                },
              ],
            ],
          },
        },

        // FILA 2: CONSIGNEE / KARGORU SAS
        {
          table: {
            widths: ["50%", "50%"],
            body: [
              [
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    sectionHeader(t.consignee),
                    {
                      text: consigneeFullText,
                      fontSize: 7.2,
                      color: DARK,
                      margin: [4, 0, 4, 3],
                      lineHeight: 1,
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  fillColor: LIGHT,
                  stack: [
                    {
                      text: "KARGORU SAS",
                      fontSize: 18,
                      bold: true,
                      color: DARK,
                      alignment: "center",
                      margin: [4, 0, 4, 1],
                    },
                    {
                      text: forwarderNit,
                      fontSize: 10,
                      color: "#5a6a80",
                      alignment: "center",
                      margin: [4, 2, 4, 1],
                    },
                    {
                      text: forwarderAddress,
                      fontSize: 10,
                      color: "#5a6a80",
                      alignment: "center",
                      margin: [4, 0, 4, 1],
                    },
                    {
                      text: forwarderCity,
                      fontSize: 10,
                      bold: true,
                      color: DARK,
                      alignment: "center",
                      margin: [4, 0, 4, 4],
                    },
                  ],
                },
              ],
            ],
          },
        },
      // FILA 3: NOTIFY PARTY / TEXTO LEGAL
        {
          table: {
            widths: ["50%", "50%"],
            body: [
              [
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    sectionHeader(t.notifyParty),
                    {
                      text: notifyFullText,
                      fontSize: 8.5,
                      color: DARK,
                      margin: [4, 0, 4, 3],
                      lineHeight: 1.05,
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  fillColor: LIGHT,
                  stack: [
                    sectionHeader("RECEIVED / RECEPCIÓN"),
                    {
                      text: t.receivedText,
                      fontSize: 6.5,
                      color: "#5a6a80",
                      alignment: "justify",
                      margin: [3, 0, 3, 2],
                      lineHeight: 1,
                    },
                  ],
                },
              ],
            ],
          },
        },
        // FILA 4: PRE CARRIAGE BY / PLACE OF RECEIPT
        {
          table: {
            widths: ["50%", "50%"],
            body: [
              [
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    {
                      text: t.preCarriageBy,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      margin: [5, 3, 5, 1],
                    },
                    {
                      text: preCarriageBy,
                      fontSize: 8,
                      color: DARK,
                      margin: [4, 0, 4, 2],
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    {
                      text: t.placeOfReceipt,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      alignment: "center",
                      margin: [6, 0, 6, 1],
                    },
                    {
                      text: placeOfReceipt,
                      fontSize: 8,
                      color: DARK,
                      alignment: "center",
                      margin: [4, 0, 4, 2],
                    },
                  ],
                },
              ],
            ],
          },
        },

        // FILA 5: VESSEL / PORT OF LOADING / ETD / ORIGINALS
        {
          table: {
            widths: ["28%", "28%", "22%", "22%"],
            body: [
              [
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    {
                      text: t.vesselVoyageFlag,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      margin: [6, 4, 6, 1],
                    },
                    {
                      text: vesselVoyageFlag,
                      fontSize: 8,
                      color: DARK,
                      margin: [6, 0, 6, 4],
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    {
                      text: t.portOfLoading,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      alignment: "center",
                      margin: [6, 4, 6, 1],
                    },
                    {
                      text: portOfLoading,
                      fontSize: 8,
                      color: DARK,
                      alignment: "center",
                      margin: [6, 0, 6, 4],
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    {
                      text: t.etdLoading,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      alignment: "center",
                      margin: [6, 4, 6, 1],
                    },
                    {
                      text: etdLoading,
                      fontSize: 8,
                      color: DARK,
                      alignment: "center",
                      margin: [6, 0, 6, 4],
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    {
                      text: t.originalsBL,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      alignment: "center",
                      margin: [4, 4, 4, 1],
                    },
                    {
                      text: String(originalsBL),
                      fontSize: 9,
                      bold: true,
                      color: BLUE,
                      alignment: "center",
                      margin: [4, 0, 4, 4],
                    },
                  ],
                },
              ],
            ],
          },
        },

        // FILA 6: PORT OF DISCHARGE / PLACE OF DELIVERY / TYPE OF MOVEMENT
        {
          table: {
            widths: ["28%", "28%", "44%"],
            body: [
              [
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    {
                      text: t.portOfDischarge,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      margin: [6, 4, 6, 1],
                    },
                    {
                      text: portOfDischarge,
                      fontSize: 8,
                      bold: true,
                      color: DARK,
                      margin: [6, 0, 6, 4],
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  stack: [
                    {
                      text: t.placeOfDelivery,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      alignment: "center",
                      margin: [6, 4, 6, 1],
                    },
                    {
                      text: placeOfDelivery,
                      fontSize: 8,
                      color: DARK,
                      alignment: "center",
                      margin: [6, 0, 6, 4],
                    },
                  ],
                },
                {
                  border: cellBorder,
                  borderColor: borderColorArr,
                  fillColor: LIGHT,
                  stack: [
                    {
                      text: t.typeOfMovement,
                      fontSize: 7.2,
                      bold: true,
                      color: GRAY,
                      alignment: "center",
                      margin: [6, 4, 6, 1],
                    },
                    {
                      text: typeOfMovement,
                      fontSize: 10,
                      bold: true,
                      color: BLUE,
                      alignment: "center",
                      margin: [6, 0, 6, 6],
                    },
                  ],
                },
              ],
            ],
          },
        },
        // PARTICULARS HEADER
        {
          ...(containersData.length > MAX_CONTAINERS_FIRST_PAGE
            ? { pageBreak: "before" }
            : {}),
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: t.particulars,
                  fontSize: 12,
                  bold: true,
                  color: WHITE,
                  fillColor: DARK,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [2, 2, 2, 2],
                },
              ],
            ],
          },
          keepWithNext: 1,
          margin: [0, 4, 0, 0],
        },

        // TABLA DE CONTENEDORES
        {
          table: {
            headerRows: 1,
            // IMPORTANTE:
            // una fila no se parte entre dos páginas.
            dontBreakRows: true,
            keepWithHeaderRows: 1,

            widths: ["19%", "9%", "45%", "14%", "13%"],

            body: [
              [
                {
                  text: t.marksNos,
                  fontSize: 8,
                  bold: true,
                  color: DARK,
                  fillColor: LIGHT,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [4, 4, 4, 4],
                },
                {
                  text: t.noPkgs,
                  fontSize: 8,
                  bold: true,
                  color: DARK,
                  fillColor: LIGHT,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [4, 4, 4, 4],
                },
                {
                  text: t.descriptionGoods,
                  fontSize: 8,
                  bold: true,
                  color: DARK,
                  fillColor: LIGHT,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [4, 4, 4, 4],
                },
                {
                  text: t.grossWeight,
                  fontSize: 8,
                  bold: true,
                  color: DARK,
                  fillColor: LIGHT,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [4, 4, 4, 4],
                },
                {
                  text: t.measurement,
                  fontSize: 8,
                  bold: true,
                  color: DARK,
                  fillColor: LIGHT,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [4, 4, 4, 4],
                },
              ],

              ...tableBodyRows,

              totalsRow,
            ],
          },
        },
      // FILA FINAL: TIPO COPIA / FECHA Y LUGAR / BY
        {
          unbreakable: true,
          table: {
            widths: ["30%", "18%", "30%", "22%"],
            body: [
              [
                {
                  text: tipoCopia,
                  fontSize: 11,
                  bold: true,
                  color: WHITE,
                  fillColor: DARK,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [3, 3, 3, 3],
                },
                {
                  text: t.dateAndPlace,
                  fontSize: 7,
                  bold: true,
                  color: GRAY,
                  fillColor: LIGHT,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [3, 3, 3, 3],
                },
                {
                  text: issueDate,
                  fontSize: 8,
                  bold: true,
                  color: DARK,
                  fillColor: LIGHT,
                  alignment: "center",
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [3, 3, 3, 3],
                },
                {
                  fillColor: LIGHT,
                  border: cellBorder,
                  borderColor: borderColorArr,
                  margin: [3, 3, 3, 3],
                  stack: [
                    {
                      text: issuePlace,
                      fontSize: 8,
                      bold: true,
                      color: DARK,
                      alignment: "center",
                    },
                    {
                      text: t.by,
                      fontSize: 7,
                      bold: true,
                      color: BLUE,
                      alignment: "right",
                      margin: [0, 2, 0, 0],
                    },
                  ],
                },
              ],
            ],
          },
          margin: [0, 1, 4, 1],
        },
      ],
    },

  ],

  styles: {
    default: {
      font: "Roboto",
    },
  },
};

// ═══════════════════════════════ FIN DEL CÓDIGO REAL ════════════════════════════
// El Playground pinta lo que esté en la variable `dd`.
var dd = pdfDefinition;