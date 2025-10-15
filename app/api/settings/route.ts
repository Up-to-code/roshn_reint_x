import { NextRequest, NextResponse } from 'next/server';
import { readSettings, writeSettings, resetSettings } from '@/lib/db-utils';

// GET /api/settings - Read all settings
export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to read settings' },
      { status: 500 }
    );
  }
}

// POST /api/settings - Update all settings
export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    const success = await writeSettings(settings);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Settings saved successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid settings data' },
      { status: 400 }
    );
  }
}

// PUT /api/settings/reset - Reset to default settings
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'reset') {
      const success = await resetSettings();
      
      if (success) {
        return NextResponse.json({ 
          success: true, 
          message: 'Settings reset to default' 
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Failed to reset settings' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to reset settings' },
      { status: 500 }
    );
  }
}