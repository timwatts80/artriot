export function generateVoucherEmailHTML(data: {
  purchaserName: string;
  recipientName?: string;
  code: string;
  amount: number;
  message?: string;
}) {
  const recipientDisplay = data.recipientName ? `for ${data.recipientName}` : '';
  
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111; color: #fff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #fff; margin: 0;">
      Art<span style="color: #f11568;">Riot</span> Live
    </h1>
  </div>
  
  <div style="text-align: center; margin-bottom: 40px;">
    <h2 style="color: #f11568; margin-bottom: 10px;">You've Received a Gift! 🎁</h2>
    <p style="color: #ccc; font-size: 18px;">A ticket to creativity ${recipientDisplay}</p>
  </div>

  <div style="background: #222; padding: 30px; border-radius: 12px; border: 2px dashed #f11568; text-align: center; margin: 30px 0;">
    <p style="color: #888; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-bottom: 10px;">Voucher Code</p>
    <div style="font-family: monospace; font-size: 32px; color: #fff; letter-spacing: 4px; font-weight: bold; background: #000; padding: 15px; border-radius: 8px; display: inline-block;">
      ${data.code}
    </div>
    <p style="color: #ccc; margin-top: 20px;">Value: 1 Event Ticket (approx $${data.amount})</p>
  </div>

  ${data.message ? `
  <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 30px 0; font-style: italic;">
    <p style="color: #fff; margin: 0;">"${data.message}"</p>
    <p style="color: #666; margin-top: 10px; font-size: 14px;">- From ${data.purchaserName}</p>
  </div>
  ` : ''}

  <div style="margin: 40px 0;">
    <h3 style="color: #fff;">How to Redeem:</h3>
    <ol style="color: #ccc; line-height: 1.8; padding-left: 20px;">
      <li>Visit <strong>artriot.live</strong> and choose any upcoming event</li>
      <li>Click "Register" and fill in your details</li>
      <li>Enter your code <strong>${data.code}</strong> in the "Gift Voucher" field at checkout</li>
      <li>The ticket cost will be covered instantly!</li>
    </ol>
  </div>

  <div style="text-align: center; margin-top: 40px;">
    <a href="https://artriot.live" style="background-color: #f11568; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
      Browse Events
    </a>
  </div>
  
  <hr style="border: none; border-top: 1px solid #333; margin: 40px 0;">
  <p style="color: #666; font-size: 12px; text-align: center;">
    This voucher is valid for one-time use on any standard Art Riot Live event.
    <br>Questions? Contact info@artriot.live
  </p>
</div>
  `;
}
