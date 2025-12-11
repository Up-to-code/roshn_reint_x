
import { fs } from 'fs';

async function main() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing POST /api/properties...');
  const createRes = await fetch(`${baseUrl}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titleEn: 'Debug Property',
      titleAr: 'Debug Property Ar',
      city: 'Riyadh',
      price: 1000000,
      images: []
    })
  });
  
  if (!createRes.ok) {
    const text = await createRes.text();
    console.log('Error captured to error.txt');
    await Bun.write('error.txt', text);
  } else {
    console.log('Success - unexpected');
  }
}

main().catch(console.error);
