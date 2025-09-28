import { NextRequest, NextResponse } from 'next/server';
import { createCareerApplication } from '@/lib/repositories/careerApplicationRepository';
import type { NewCareerApplication } from '@/types/careerApplication';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ['firstName','lastName','email','phone','place','department','resume'];
    for(const k of required) {
      if(!body[k]) return NextResponse.json({ error: `Missing field ${k}` }, { status: 400 });
    }
    const input: NewCareerApplication = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      place: body.place.trim(),
      department: body.department.trim(), // already label
      resume: body.resume,
    };
    const created = await createCareerApplication(input);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
