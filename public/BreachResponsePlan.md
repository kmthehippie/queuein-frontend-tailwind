# 🧯 queuein – Data Breach Response Plan

**Version:** 1.0  
**Last updated:** _(insert date)_  
**Owner:** Data Protection Officer / Founder  
**Applies to:** queuein (https://queuein.onrender.com) and all staff, contractors, and developers with access to personal data.

---

## 1. Purpose

This plan defines how **queuein** will detect, manage, and report any personal data breaches that occur in connection with our application or database systems.  
It ensures compliance with the **Malaysian Personal Data Protection Act (PDPA)** and helps minimise harm to affected individuals or businesses.

---

## 2. Definition of a Data Breach

A **personal data breach** occurs when personal data is:

- Lost, stolen, or accidentally deleted
- Accessed or disclosed without authorisation
- Altered or corrupted without authorisation
- Made unavailable temporarily or permanently due to system failure or ransomware

**Examples:**

- Unauthorised access to customer contact details
- Exposed API key or credentials in public repositories
- Accidental email to the wrong business
- Cloud database misconfiguration allowing external access

---

## 3. Roles and Responsibilities

| Role                           | Person/Team                  | Responsibilities                                                |
| ------------------------------ | ---------------------------- | --------------------------------------------------------------- |
| **Incident Lead / DPO**        | _(Founder/Developer Name)_   | Coordinate breach response, lead investigation, prepare reports |
| **Technical Lead**             | _(Developer/Engineer Name)_  | Secure systems, assess logs, patch vulnerabilities              |
| **Legal / Compliance Contact** | _(External or self)_         | Determine PDPC notification requirements, draft notifications   |
| **Communications Contact**     | _(Founder or Support Email)_ | Notify affected users/businesses, handle press or inquiries     |

---

## 4. Breach Response Phases

### 🔹 Step 1: Detection

**Goal:** Identify and confirm the breach quickly.

**Actions:**

- Monitor server logs and error tracking tools (e.g., Sentry, Render logs).
- Investigate any abnormal access patterns or failed login attempts.
- Employees or developers must report any suspected breach immediately to the Incident Lead via internal chat/email.

**Detection checklist:**

- [ ] Security alert received or suspicious activity detected
- [ ] Logs reviewed for confirmation
- [ ] Scope of systems potentially affected identified

---

### 🔹 Step 2: Containment

**Goal:** Stop further data exposure.

**Actions:**

- Revoke compromised credentials (API keys, tokens, passwords)
- Disable affected systems or isolate servers if needed
- Suspend access for affected user accounts until confirmed safe
- Back up relevant evidence for investigation (don’t delete logs)

**Containment checklist:**

- [ ] Compromised access revoked
- [ ] Systems isolated or shut down if needed
- [ ] Backups verified and secured
- [ ] Temporary communication plan activated

---

### 🔹 Step 3: Assessment and Investigation

**Goal:** Determine scope, cause, and risk level.

**Questions to answer:**

- What data was affected (names, emails, contact numbers)?
- Was data encrypted or anonymised?
- How many individuals/businesses are affected?
- What’s the likely harm (identity theft, spam, business disruption)?

**Record findings in the Incident Log (Section 7).**

---

### 🔹 Step 4: Notification

**Goal:** Comply with PDPA obligations and maintain transparency.

**When to notify:**

- Notify **PDPC** if there is a risk of **significant harm** or **large-scale impact**, within **72 hours** of discovery.
- Notify affected **business accounts (data controllers)** as soon as possible.
- If you act as a **data controller**, notify **end-users/customers** within **7 days**.

---

#### 📨 Breach Notification Template

**Subject:** Notification of Data Incident – queuein

> Dear [User/Business Name],
>
> We are writing to inform you that on [date/time], queuein discovered a data security incident involving our system.  
> The affected data may include [describe briefly, e.g., customer names and phone numbers].
>
> Upon discovery, we immediately took steps to contain the issue, investigate the root cause, and implement security measures to prevent recurrence.
>
> Based on our current assessment, [state whether misuse has been detected or the potential impact].
>
> Recommended action for you: [e.g., reset password, monitor for suspicious messages].
>
> For further information or support, contact us at: [support@queuein.app].
>
> Regards,  
> **queuein Security Team**  
> [https://queuein.onrender.com](https://queuein.onrender.com)

---

### 🔹 Step 5: Recovery and Lessons Learned

**Goal:** Restore normal operations and prevent recurrence.

**Actions:**

- Patch vulnerabilities or misconfigurations
- Reset affected systems and credentials
- Review policies and access control
- Conduct an internal post-mortem within 7 days
- Update documentation, and train staff if applicable

**Recovery checklist:**

- [ ] Vulnerability identified and fixed
- [ ] Affected systems verified as secure
- [ ] PDPC and users notified (if applicable)
- [ ] Incident report completed

---

## 5. Evidence and Documentation

Maintain a **Breach Register** (a simple Google Sheet or Notion table works fine):

| Date Detected | Nature of Breach | Affected Systems | Number of Records | Reported To | Actions Taken | Closed (Y/N) |
| ------------- | ---------------- | ---------------- | ----------------- | ----------- | ------------- | ------------ |
|               |                  |                  |                   |             |               |              |

This record helps demonstrate due diligence if PDPC investigates.

---

## 6. Prevention Measures

- Use **encryption** for all personal data (already implemented ✅)
- Enforce **HTTPS** and secure cookies
- Regularly update dependencies and patch vulnerabilities
- Apply **role-based access control (RBAC)**
- Run **regular database backups** and store them securely
- Avoid storing plaintext secrets (use environment variables)
- Enable **two-factor authentication (2FA)** on admin panels
- Maintain **audit logs** (already part of your schema ✅)

---

## 7. Record of Incidents

| Incident ID | Date | Summary | Notified (Y/N) | Actions | Status |
| ----------- | ---- | ------- | -------------- | ------- | ------ |
|             |      |         |                |         |        |

---

## 8. Review Schedule

This plan should be reviewed **annually** or following any major data incident.  
Document any updates below.

| Version | Date            | Updated By | Summary of Changes      |
| ------- | --------------- | ---------- | ----------------------- |
| 1.0     | _(insert date)_ | _(name)_   | Initial version created |

---

> **Disclaimer:**  
> This plan is designed to provide operational guidance for managing data incidents under the Malaysian PDPA. It does not constitute legal advice.  
> queuein should seek independent legal review before implementing or relying on this plan for regulatory reporting.
