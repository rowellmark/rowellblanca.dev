'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import type { ContactModalProps } from './contact-modal-dialog';

const ContactModalDialog = dynamic(() => import('./contact-modal-dialog').then((m) => m.ContactModal), { ssr: false });

// The popup (and framer-motion) is downloaded the first time it opens; it stays
// mounted afterwards so its exit animation and form state still work.
export function ContactModal(props: ContactModalProps) {
  const [opened, setOpened] = useState(props.isOpen);
  if (props.isOpen && !opened) setOpened(true);
  return opened ? <ContactModalDialog {...props} /> : null;
}
