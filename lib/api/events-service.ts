
import { prisma } from '@/lib/db';

export type EventType = 
  | 'property_created'
  | 'property_updated'
  | 'property_deleted'
  | 'contact_submission'
  | 'other';

export interface CreateEventParams {
  type: EventType;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export class EventsService {
  /**
   * Safely creates an event without throwing errors that would block the main request
   */
  static async create(params: CreateEventParams): Promise<void> {
    try {
      await prisma.event.create({
        data: {
          type: params.type,
          title: params.title,
          description: params.description,
          metadata: params.metadata || {},
        },
      });
    } catch (error) {
      console.error("⚠️ Failed to log event:", error);
      // We swallow the error here so it doesn't fail the parent operation
    }
  }
}
