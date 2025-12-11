
import { PropertiesService } from '../lib/api/properties-service';

async function main() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('1. Testing POST /api/properties...');
  const createRes = await fetch(`${baseUrl}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titleEn: 'Test Property',
      titleAr: 'Test Property Ar',
      city: 'Riyadh',
      price: 1000000,
      images: []
    })
  });
  
  if (!createRes.ok) {
    console.error('POST failed:', await createRes.text());
    process.exit(1);
  }
  
  const created = await createRes.json();
  console.log('Created Property ID:', created.id);
  
  console.log('2. Testing GET /api/properties/[id]...');
  const getRes = await fetch(`${baseUrl}/api/properties/${created.id}`);
  if (!getRes.ok) {
    console.error('GET failed:', await getRes.text());
    process.exit(1);
  }
  const fetched = await getRes.json();
  console.log('Fetched Price:', fetched.price);
  
  console.log('3. Testing PUT /api/properties/[id]...');
  const updateRes = await fetch(`${baseUrl}/api/properties/${created.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price: 1500000
    })
  });
  
  if (!updateRes.ok) {
    console.error('PUT failed:', await updateRes.text());
    process.exit(1);
  }
  const updated = await updateRes.json();
  console.log('Updated Price:', updated.price);
  
  console.log('4. Testing DELETE /api/properties/[id]...');
  const deleteRes = await fetch(`${baseUrl}/api/properties/${created.id}`, {
    method: 'DELETE'
  });
  
  if (!deleteRes.ok) {
    console.error('DELETE failed:', await deleteRes.text());
    process.exit(1);
  }
  console.log('Delete successful');
  
  console.log('CRUD Verification Passed!');
}

main().catch(console.error);
