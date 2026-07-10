import logging

import aiosmtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger("email_service")


async def _send(to_email: str, subject: str, plain_text: str, html: str) -> None:
    msg = EmailMessage()
    msg["From"] = settings.email_sender_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(plain_text)
    msg.add_alternative(html, subtype="html")

    await aiosmtplib.send(
        msg,
        hostname=settings.email_smtp_server,
        port=settings.email_smtp_port,
        username=settings.email_login,
        password=settings.email_sender_password,
        start_tls=True,
    )


def _wrap(title: str, body_html: str) -> str:
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#111;margin-bottom:4px;">Flat Productions</h2>
      <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;margin-top:0;">{title}</p>
      {body_html}
      <p style="color:#aaa;font-size:11px;margin-top:32px;">Kigali, Rwanda &middot; Flat Production Limited</p>
    </div>
    """


async def send_otp_email(to_email: str, code: str, expires_minutes: int) -> None:
    subject = "Your Flat Productions admin verification code"
    plain = f"Your verification code is {code}. It expires in {expires_minutes} minutes."
    html = _wrap(
        "Admin Verification",
        f"""
        <p style="color:#333;font-size:14px;">Use the code below to finish signing in to the admin dashboard.</p>
        <div style="background:#f5f6f8;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
          <span style="font-family:monospace;font-size:32px;font-weight:bold;letter-spacing:0.3em;color:#111;">{code}</span>
        </div>
        <p style="color:#888;font-size:12px;">This code expires in {expires_minutes} minutes. If you didn't request this, you can ignore this email.</p>
        """,
    )
    await _send(to_email, subject, plain, html)


async def send_password_reset_email(to_email: str, code: str, expires_minutes: int) -> None:
    subject = "Reset your Flat Productions admin password"
    plain = f"Your password reset code is {code}. It expires in {expires_minutes} minutes."
    html = _wrap(
        "Password Reset",
        f"""
        <p style="color:#333;font-size:14px;">Use the code below to reset your admin password.</p>
        <div style="background:#f5f6f8;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
          <span style="font-family:monospace;font-size:32px;font-weight:bold;letter-spacing:0.3em;color:#111;">{code}</span>
        </div>
        <p style="color:#888;font-size:12px;">This code expires in {expires_minutes} minutes. If you didn't request this, you can safely ignore this email — your password will not change.</p>
        """,
    )
    await _send(to_email, subject, plain, html)


async def send_admin_invite_email(to_email: str, temp_password: str, invited_by_email: str) -> None:
    subject = "You've been invited to the Flat Productions admin dashboard"
    plain = (
        f"You've been invited by {invited_by_email} to manage the Flat Productions website.\n"
        f"Email: {to_email}\nTemporary password: {temp_password}\n"
        "Please log in and change your password."
    )
    html = _wrap(
        "Admin Invite",
        f"""
        <p style="color:#333;font-size:14px;">You've been invited by <strong>{invited_by_email}</strong> to manage the Flat Productions website.</p>
        <table style="margin:20px 0;font-size:14px;color:#333;">
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Email</td><td>{to_email}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Temp password</td><td style="font-family:monospace;">{temp_password}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;">Please log in and change your password as soon as possible.</p>
        """,
    )
    await _send(to_email, subject, plain, html)


async def send_contact_notification(message) -> None:
    subject = f"New contact form message from {message.full_name}"
    plain = (
        f"Name: {message.full_name}\nEmail: {message.email}\nPhone: {message.phone or '-'}\n"
        f"Service: {message.service or '-'}\n\n{message.message}"
    )
    html = _wrap(
        "New Contact Message",
        f"""
        <table style="font-size:14px;color:#333;margin-bottom:16px;">
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Name</td><td>{message.full_name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Email</td><td>{message.email}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Phone</td><td>{message.phone or '-'}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Service</td><td>{message.service or '-'}</td></tr>
        </table>
        <p style="color:#333;font-size:14px;white-space:pre-wrap;">{message.message}</p>
        """,
    )
    await _send(settings.studio_notify_email, subject, plain, html)


async def send_contact_autoreply(to_email: str, full_name: str) -> None:
    subject = "We received your message — Flat Productions"
    plain = f"Hi {full_name}, thanks for reaching out. We'll reply within 24 hours."
    html = _wrap(
        "Message Received",
        f"""
        <p style="color:#333;font-size:14px;">Hi {full_name},</p>
        <p style="color:#333;font-size:14px;">Thanks for reaching out to Flat Productions. We've received your message and will get back to you within 24 hours.</p>
        """,
    )
    await _send(to_email, subject, plain, html)


async def try_send(coro) -> bool:
    try:
        await coro
        return True
    except Exception:
        logger.exception("Failed to send email")
        return False
