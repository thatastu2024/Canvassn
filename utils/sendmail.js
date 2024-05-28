import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const RESEND_API_KEY = "re_ATzZAzpy_EcvvoZcvkErAJCKbAhYaiaz3";


export default async function sendMail(data){
    const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: `<strong>${data.text}</strong>`,
    }),
  });
  if (res.ok) {
    const data = await res.json();
    return data
  }
}