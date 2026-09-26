import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  Packer,
  WidthType,
  AlignmentType,
  BorderStyle
} from "docx";
import { ChatResponse } from "@/types/travel";

export async function exportItineraryToWord(data: ChatResponse): Promise<void> {
  const { trip, hotels, flights, itinerary, estimated_cost, message, sources } = data;
  const topHotel = hotels && hotels.length > 0 ? hotels[0] : null;

  // Thin borders for tables
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  };

  const sections: (Paragraph | Table)[] = [];

  // Title Header
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "RAAHI · MAHARASHTRA AI TRAVEL PLANNER",
          size: 22,
          bold: true,
          color: "D97706", // Amber
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `${trip.destination} - ${trip.duration_days} Day Personalized Itinerary`,
          size: 32,
          bold: true,
          color: "18181B",
        }),
      ],
    })
  );

  // Trip Summary Table
  const summaryRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: "F4F4F5" },
          children: [new Paragraph({ children: [new TextRun({ text: "Destination", bold: true })] })],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          children: [new Paragraph(trip.destination)],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: "F4F4F5" },
          children: [new Paragraph({ children: [new TextRun({ text: "Duration", bold: true })] })],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          children: [new Paragraph(`${trip.duration_days} Days / ${Math.max(0, trip.duration_days - 1)} Nights`)],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: "F4F4F5" },
          children: [new Paragraph({ children: [new TextRun({ text: "Total Budget", bold: true })] })],
        }),
        new TableCell({
          children: [new Paragraph(`₹${trip.budget.toLocaleString()}`)],
        }),
        new TableCell({
          shading: { fill: "F4F4F5" },
          children: [new Paragraph({ children: [new TextRun({ text: "Travellers", bold: true })] })],
        }),
        new TableCell({
          children: [new Paragraph(`${trip.travellers} (${trip.traveller_types.join(", ") || "traveler"})`)],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: "F4F4F5" },
          children: [new Paragraph({ children: [new TextRun({ text: "Pacing", bold: true })] })],
        }),
        new TableCell({
          children: [new Paragraph(trip.pace.charAt(0).toUpperCase() + trip.pace.slice(1))],
        }),
        new TableCell({
          shading: { fill: "F4F4F5" },
          children: [new Paragraph({ children: [new TextRun({ text: "Food Pref", bold: true })] })],
        }),
        new TableCell({
          children: [new Paragraph(trip.food_preferences.join(", ") || "Vegetarian")],
        }),
      ],
    }),
  ];

  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorder,
      rows: summaryRows,
    }),
    new Paragraph({ spacing: { after: 200 } })
  );

  // Overview Narrative
  sections.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "Trip Overview", bold: true, color: "18181B" })],
    }),
    new Paragraph({
      spacing: { after: 250 },
      children: [new TextRun({ text: message.replace(/\*\*/g, ""), size: 21, color: "3F3F46" })],
    })
  );

  // Accommodation Section
  if (topHotel) {
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: "Recommended Accommodation", bold: true, color: "18181B" })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: topHotel.name, bold: true, size: 24, color: "B45309" }),
          new TextRun({ text: `  ·  ₹${topHotel.price_per_night.toLocaleString()} / night`, bold: true, size: 22 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: `Rating: ★ ${topHotel.rating}  |  Location: ${topHotel.distance_km > 0 ? `${topHotel.distance_km} km from ${topHotel.distance_reference}` : topHotel.location || topHotel.distance_reference}`,
            italics: true,
            color: "71717A",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: "Why Chosen: ", bold: true }),
          new TextRun({ text: topHotel.rationale }),
        ],
      })
    );

    if (topHotel.amenities && topHotel.amenities.length > 0) {
      sections.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Amenities: ", bold: true }),
            new TextRun({ text: topHotel.amenities.join(", ") }),
          ],
        })
      );
    }

    if (topHotel.booking_url) {
      sections.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Booking Link: ", bold: true }),
            new TextRun({ text: topHotel.booking_url, color: "2563EB" }),
          ],
        })
      );
    }
  }

  // Flight Section (if present)
  if (flights && flights.length > 0) {
    const bestFlight = flights[0];
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: "Recommended Flight", bold: true, color: "18181B" })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: `${bestFlight.airline} (${bestFlight.flight_number || "Flight"})`, bold: true, size: 24, color: "1D4ED8" }),
          new TextRun({ text: `  ·  ₹${bestFlight.price.toLocaleString()} / passenger`, bold: true, size: 22 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `Route: ${bestFlight.departure_airport.id || "DEP"} (${bestFlight.departure_airport.time || ""}) → ${bestFlight.arrival_airport.id || "ARR"} (${bestFlight.arrival_airport.time || ""})  |  Duration: ${Math.floor(bestFlight.duration_minutes / 60)}h ${bestFlight.duration_minutes % 60}m  |  Stops: ${bestFlight.stops === 0 ? "Non-stop" : `${bestFlight.stops} stop(s)`}`,
            italics: true,
            color: "71717A",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Booking / Inquiry: ", bold: true }),
          new TextRun({ text: bestFlight.booking_url || "Search via Google Flights", color: "2563EB" }),
        ],
      })
    );
  }

  // Day-by-Day Itinerary
  if (itinerary && itinerary.length > 0) {
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 250, after: 150 },
        children: [new TextRun({ text: "Daily Itinerary Timeline", bold: true, color: "18181B" })],
      })
    );

    for (const day of itinerary) {
      sections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 180, after: 80 },
          children: [
            new TextRun({
              text: `Day ${day.day_number}: ${day.title}`,
              bold: true,
              size: 24,
              color: "18181B",
            }),
          ],
        })
      );

      // Activities Table for this Day
      const activityRows: TableRow[] = [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              shading: { fill: "E4E4E7" },
              children: [new Paragraph({ children: [new TextRun({ text: "Time", bold: true })] })],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: "E4E4E7" },
              children: [new Paragraph({ children: [new TextRun({ text: "Place / Activity", bold: true })] })],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: "E4E4E7" },
              children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })],
            }),
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              shading: { fill: "E4E4E7" },
              children: [new Paragraph({ children: [new TextRun({ text: "Transit & Notes", bold: true })] })],
            }),
          ],
        }),
      ];

      for (const act of day.activities) {
        const transitInfo = act.travel_from_previous_minutes > 0
          ? `${act.travel_from_previous_minutes}m drive (${act.travel_distance_km}km). `
          : "";
        const noteText = `${transitInfo}${act.notes || ""}`;

        activityRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(act.time)],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: act.place, bold: true })] })],
              }),
              new TableCell({
                children: [new Paragraph(act.category)],
              }),
              new TableCell({
                children: [new Paragraph(noteText || "-")],
              }),
            ],
          })
        );
      }

      sections.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: tableBorder,
          rows: activityRows,
        }),
        new Paragraph({ spacing: { after: 150 } })
      );
    }
  }

  // Cost Breakdown Section
  sections.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 250, after: 120 },
      children: [new TextRun({ text: "Estimated Budget Breakdown", bold: true, color: "18181B" })],
    })
  );

  const costRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { fill: "E4E4E7" },
          children: [new Paragraph({ children: [new TextRun({ text: "Expense Category", bold: true })] })],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { fill: "E4E4E7" },
          children: [new Paragraph({ children: [new TextRun({ text: "Estimated Amount (INR)", bold: true })] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Accommodation")] }),
        new TableCell({ children: [new Paragraph(`₹${estimated_cost.accommodation.toLocaleString()}`)] }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Food & Dining")] }),
        new TableCell({ children: [new Paragraph(`₹${estimated_cost.food.toLocaleString()}`)] }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Transport & Fuel / Flights")] }),
        new TableCell({ children: [new Paragraph(`₹${estimated_cost.transport.toLocaleString()}`)] }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Activities & Sightseeing")] }),
        new TableCell({ children: [new Paragraph(`₹${estimated_cost.activities.toLocaleString()}`)] }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Miscellaneous / Emergency Reserve")] }),
        new TableCell({ children: [new Paragraph(`₹${estimated_cost.miscellaneous.toLocaleString()}`)] }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { fill: "F4F4F5" },
          children: [new Paragraph({ children: [new TextRun({ text: "Total Estimated Trip Cost", bold: true })] })],
        }),
        new TableCell({
          shading: { fill: "F4F4F5" },
          children: [new Paragraph({ children: [new TextRun({ text: `₹${estimated_cost.total.toLocaleString()}`, bold: true, color: "B45309" })] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Remaining Budget Reserve", bold: true })] })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: `₹${estimated_cost.remaining_budget.toLocaleString()}`, bold: true, color: "15803D" })] })],
        }),
      ],
    }),
  ];

  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorder,
      rows: costRows,
    }),
    new Paragraph({ spacing: { after: 200 } })
  );

  // Footer & Sources
  sections.push(
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({
          text: `Verified Live Data Sources: ${sources.join(", ")}`,
          size: 18,
          italics: true,
          color: "71717A",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Generated by RAAHI AI Travel Assistant · Deterministic scoring & zero database persistence.",
          size: 16,
          italics: true,
          color: "A1A1AA",
        }),
      ],
    })
  );

  // Generate docx document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: sections,
      },
    ],
  });

  // Pack into blob and trigger browser download
  const blob = await Packer.toBlob(doc);
  const cleanDestination = trip.destination.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `RAAHI_${cleanDestination}_${trip.duration_days}Day_Itinerary.docx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
