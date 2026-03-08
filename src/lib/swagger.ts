import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Pub Kviz API",
      description: "REST API za Pub Kviz aplikaciju - platforma za organizaciju pub kvizova",
      version: "1.0.0",
      contact: {
        name: "Pub Kviz Tim",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API server",
      },
    ],
    tags: [
      { name: "Auth", description: "Autentifikacija korisnika" },
      { name: "Users", description: "Upravljanje korisnicima" },
      { name: "Teams", description: "Upravljanje timovima" },
      { name: "Events", description: "Upravljanje događajima" },
      { name: "Leagues", description: "Upravljanje ligama" },
      { name: "Join Requests", description: "Zahtevi za pridruživanje timu" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "auth_token",
          description: "JWT token u cookie-ju",
        },
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100, example: "Marko Marković" },
            email: { type: "string", format: "email", example: "marko@example.com" },
            password: { type: "string", minLength: 6, example: "password123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "marko@example.com" },
            password: { type: "string", example: "password123" },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Marko Marković" },
            email: { type: "string", example: "marko@example.com" },
            role: { type: "string", enum: ["ADMIN", "ORGANIZER", "PLAYER"], example: "PLAYER" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Marko Marković" },
            email: { type: "string", example: "marko@example.com" },
            role: { type: "string", enum: ["ADMIN", "ORGANIZER", "PLAYER"] },
            createdAt: { type: "string", format: "date-time" },
            teamId: { type: "integer", nullable: true },
            captain: { type: "boolean" },
          },
        },
        Team: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Beogradski Fantom" },
            createdAt: { type: "string", format: "date-time" },
            captain: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
              },
            },
          },
        },
        TeamStats: {
          type: "object",
          properties: {
            seasonId: { type: "integer", example: 1 },
            seasonName: { type: "string", example: "Proleće 2026" },
            teamId: { type: "integer", example: 1 },
            teamName: { type: "string", example: "Beogradski Fantom" },
            avgPoints: { type: "string", example: "45.5" },
            totalEvents: { type: "integer", example: 5 },
          },
        },
        TeamMember: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "ORGANIZER", "PLAYER"] },
          },
        },
        Event: {
          type: "object",
          properties: {
            id: { type: "string", example: "1" },
            name: { type: "string", example: "Novogodišnje zagrevanje" },
            date: { type: "string", format: "date-time" },
            location: { type: "string", example: "Kafana Druga kuća" },
            capacity: { type: "integer", example: 40 },
            theme: { type: "string", example: "Opšte znanje" },
            price: { type: "string", example: "500" },
          },
        },
        EventResult: {
          type: "object",
          properties: {
            teamId: { type: "integer" },
            teamName: { type: "string" },
            points: { type: "integer" },
          },
        },
        League: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Srpska Pab Kviz Liga" },
          },
        },
        LeagueWithSeasons: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            seasons: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  isActive: { type: "boolean" },
                },
              },
            },
          },
        },
        Standing: {
          type: "object",
          properties: {
            teamId: { type: "integer" },
            teamName: { type: "string" },
            totalPoints: { type: "number" },
            eventsPlayed: { type: "integer" },
          },
        },
        JoinRequest: {
          type: "object",
          properties: {
            teamId: { type: "integer" },
            userId: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Greška na serveru" },
          },
        },
      },
    },
  },
  apis: ["./src/app/api/**/*.ts"],
};

export const openApiSpec = swaggerJsdoc(options);
