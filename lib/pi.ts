const PI_API = "https://api.minepi.com/v2/payments";

export async function verifyPiPayment(paymentId: string) {
  const res = await fetch(`${PI_API}/${paymentId}`, {
    headers: {
      Authorization: `Key ${process.env.PI_API_KEY}`
    }
  });

  if (!res.ok) {
    throw new Error("Pi API 请求失败");
  }

  const data = await res.json();

  return data;
}
