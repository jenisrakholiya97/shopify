import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import React from 'react'
import { HomePage } from '../routes/index'

describe('VNI Export & Import Landing Page Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = vi.fn()
  })

  describe('1. Contact Details & Address (Requirements 1 & 8)', () => {
    it('renders updated phone number, email ID and Surat address', () => {
      render(<HomePage />)
      // Phone: +91 95107 36285
      expect(screen.getAllByText(/\+91 95107 36285/i).length).toBeGreaterThan(0)
      // Email: info@vniexport.com
      expect(screen.getAllByText(/info@vniexport\.com/i).length).toBeGreaterThan(0)
      // Address: Plot No. 18, Bhajiwala Estate-2, A.K. Road, Surat - 395006
      expect(screen.getAllByText(/Bhajiwala Estate-2/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/395006/i).length).toBeGreaterThan(0)
    })
  })

  describe('2. Logo and Company Name (Requirement 2)', () => {
    it('renders brand logo with VNI Export & Import', () => {
      render(<HomePage />)
      const logos = screen.getAllByText(/Export & Import/i)
      expect(logos.length).toBeGreaterThan(0)
      const vniTitles = screen.getAllByText(/VNI/i)
      expect(vniTitles.length).toBeGreaterThan(0)
    })

    it('renders main desktop navigation links', () => {
      render(<HomePage />)
      const nav = screen.getByLabelText('Main Navigation')
      expect(nav).toHaveTextContent('Products')
      expect(nav).toHaveTextContent('Why VNI')
      expect(nav).toHaveTextContent('How We Export')
      expect(nav).toHaveTextContent('About')
      expect(nav).toHaveTextContent('Contact')
    })

    it('toggles mobile navigation drawer', () => {
      render(<HomePage />)
      const menuBtn = screen.getByLabelText('Open Navigation Menu')
      expect(menuBtn).toHaveAttribute('aria-expanded', 'false')

      // Open drawer
      fireEvent.click(menuBtn)
      expect(screen.getByLabelText('Close Navigation Menu')).toHaveAttribute('aria-expanded', 'true')

      // Click a link inside mobile drawer
      const mobileNav = screen.getByLabelText('Mobile Navigation')
      const productsLink = mobileNav.querySelector('a[href="#products"]')
      expect(productsLink).toBeInTheDocument()
      if (productsLink) {
        fireEvent.click(productsLink)
      }

      // Drawer closes
      expect(screen.getByLabelText('Open Navigation Menu')).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('3. Products Catalog (Requirement 4)', () => {
    it('removes Chana and Moong as separate cards and adds Pulses, Soyabean, and Rice', () => {
      render(<HomePage />)
      // Main product headings
      expect(screen.getByRole('heading', { name: /^Fruits$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Vegetables$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Nuts$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Pulses$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Soyabean$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Rice$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Indian Spices$/i })).toBeInTheDocument()

      // Chana and Moong must NOT be separate product headings
      expect(screen.queryByRole('heading', { name: /^Chana$/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /^Moong$/i })).not.toBeInTheDocument()
    })

    it('verifies Pulses contains Chana, Moong, and Kidney Beans', () => {
      render(<HomePage />)
      expect(screen.getByText(/Chana \(Kabuli Chickpeas & Desi Brown\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Moong \(Whole Green & Split Dal\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Kidney Beans \(Red & Chitra Rajma\)/i)).toBeInTheDocument()
    })

    it('verifies Rice contains Basmati Rice 1121, Pusa 1509, Traditional Basmati, and white/brown note', () => {
      render(<HomePage />)
      expect(screen.getByText(/Basmati Rice 1121/i)).toBeInTheDocument()
      expect(screen.getByText(/Pusa 1509/i)).toBeInTheDocument()
      expect(screen.getByText(/Traditional Basmati/i)).toBeInTheDocument()
      expect(screen.getAllByText(/white and brown/i).length).toBeGreaterThan(0)
    })

    it('filters products when clicking category tabs', () => {
      render(<HomePage />)
      const riceTab = screen.getByRole('tab', { name: 'Rice' })
      fireEvent.click(riceTab)

      expect(screen.getByRole('heading', { name: /^Rice$/i })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /^Fruits$/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /^Vegetables$/i })).not.toBeInTheDocument()

      // Reset to all
      const allTab = screen.getByRole('tab', { name: 'All Products' })
      fireEvent.click(allTab)
      expect(screen.getByRole('heading', { name: /^Fruits$/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /^Vegetables$/i })).toBeInTheDocument()
    })

    it('filters products via search input for Pulses or Soyabean', () => {
      render(<HomePage />)
      const searchInput = screen.getByPlaceholderText(/Search products, varieties\.\.\./i)
      fireEvent.change(searchInput, { target: { value: 'Soyabean' } })

      expect(screen.getByRole('heading', { name: /^Soyabean$/i })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /^Fruits$/i })).not.toBeInTheDocument()

      // Trigger empty search state to verify Reset Filters button
      fireEvent.change(searchInput, { target: { value: 'NonExistentCommodityXYZ' } })
      expect(screen.getByText(/No export products match/i)).toBeInTheDocument()

      const resetBtn = screen.getByRole('button', { name: /Reset Filters/i })
      fireEvent.click(resetBtn)
      expect(screen.getByRole('heading', { name: /^Fruits$/i })).toBeInTheDocument()
    })
  })

  describe('4. Product Technical Specifications Modal', () => {
    it('opens modal for Rice and displays varieties and white/brown notes', () => {
      render(<HomePage />)
      const riceCard = screen.getByRole('heading', { name: /^Rice$/i }).closest('article')
      expect(riceCard).toBeInTheDocument()

      const quickSpecsBtn = riceCard?.querySelector('button[aria-label*="View detailed specifications"]')
      expect(quickSpecsBtn).toBeInTheDocument()
      if (quickSpecsBtn) {
        fireEvent.click(quickSpecsBtn)
      }

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/Rice Details/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Basmati Rice 1121/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/white and brown/i).length).toBeGreaterThan(0)

      // Close modal
      const closeBtn = screen.getByLabelText('Close dialog')
      fireEvent.click(closeBtn)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes modal on Escape key press', () => {
      render(<HomePage />)
      const quickSpecsButtons = screen.getAllByRole('button', { name: /View detailed specifications/i })
      fireEvent.click(quickSpecsButtons[0])
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'Escape' })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('5. Ports, Delivery Terms & MOQ (Requirements 3, 5, 6)', () => {
    it('renders and switches to Mumbai (by Air) port tab', () => {
      render(<HomePage />)
      const airTab = screen.getByRole('tab', { name: /Mumbai \(by Air\)/i })
      expect(airTab).toBeInTheDocument()

      fireEvent.click(airTab)
      expect(screen.getByText(/BOM AIR/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Air Cargo/i).length).toBeGreaterThan(0)
    })

    it('renders Delivery Terms (Incoterms): CIF / CIP / FOB / FCA', () => {
      render(<HomePage />)
      expect(screen.getByText(/Incoterms: CIF \/ CIP \/ FOB \/ FCA/i)).toBeInTheDocument()
      expect(screen.getByText('CIF')).toBeInTheDocument()
      expect(screen.getByText('CIP')).toBeInTheDocument()
      expect(screen.getByText('FOB')).toBeInTheDocument()
      expect(screen.getByText('FCA')).toBeInTheDocument()
    })

    it('renders MOQ (Minimum Order Quantity): By Sea 20 ft container, By Air 1 ton', () => {
      render(<HomePage />)
      expect(screen.getAllByText(/20 ft container/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/1 ton/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/By Sea/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/By Air/i).length).toBeGreaterThan(0)
    })
  })

  describe('6. Licence Numbers Removal (Requirement 7)', () => {
    it('ensures all licence numbers are completely removed from the entire website', () => {
      render(<HomePage />)
      // None of the old licence numbers should exist anywhere
      expect(screen.queryByText(/082100XXXX/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/10722026000123/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/24AABCV1234F1Z0/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/RCMC-AP/i)).not.toBeInTheDocument()
    })
  })

  describe('7. Interactive Quote Form & Enquire Trigger', () => {
    it('pre-fills product when clicking Enquire on Pulses card', () => {
      render(<HomePage />)
      const pulsesEnquire = screen.getByLabelText(/Enquire about Pulses/i)
      fireEvent.click(pulsesEnquire)

      const productInput = screen.getByLabelText(/Product and quantity/i) as HTMLInputElement
      expect(productInput.value).toContain('Pulses')
    })

    it('shows validation errors when submitting empty form', () => {
      render(<HomePage />)
      const submitBtn = screen.getByRole('button', { name: /Send Export Enquiry/i })
      fireEvent.click(submitBtn)

      expect(screen.getByText(/Please enter your name\./i)).toBeInTheDocument()
      expect(screen.getByText(/Please enter your company name and country\./i)).toBeInTheDocument()
      expect(screen.getByText(/Please enter your email\./i)).toBeInTheDocument()
      expect(screen.getByText(/Please specify the product and required quantity\./i)).toBeInTheDocument()
    })

    it('shows validation error when an invalid email is entered', () => {
      render(<HomePage />)
      const nameInput = screen.getByLabelText(/^Name/i)
      const companyInput = screen.getByLabelText(/Company and country/i)
      const contactInput = screen.getByLabelText(/^Email/i, { selector: 'input' })
      const productInput = screen.getByLabelText(/Product and quantity/i)

      fireEvent.change(nameInput, { target: { value: 'Fatima Zahra' } })
      fireEvent.change(companyInput, { target: { value: 'Middle East Foods LLC' } })
      fireEvent.change(contactInput, { target: { value: 'invalid-email-format' } })
      fireEvent.change(productInput, { target: { value: 'Basmati Rice 1121' } })

      const submitBtn = screen.getByRole('button', { name: /Send Export Enquiry/i })
      fireEvent.click(submitBtn)

      expect(screen.getByText(/Please enter a valid email address\./i)).toBeInTheDocument()
    })

    it('submits valid form and displays confirmation voucher with reference ID', async () => {
      render(<HomePage />)
      const nameInput = screen.getByLabelText(/^Name/i)
      const companyInput = screen.getByLabelText(/Company and country/i)
      const contactInput = screen.getByLabelText(/^Email/i, { selector: 'input' })
      const productInput = screen.getByLabelText(/Product and quantity/i)

      fireEvent.change(nameInput, { target: { value: 'Fatima Zahra' } })
      fireEvent.change(companyInput, { target: { value: 'Middle East Foods LLC, UAE' } })
      fireEvent.change(contactInput, { target: { value: 'trade@mefoods.ae' } })
      fireEvent.change(productInput, { target: { value: 'Basmati Rice 1121, 1 x 20ft FCL' } })

      const submitBtn = screen.getByRole('button', { name: /Send Export Enquiry/i })
      fireEvent.click(submitBtn)

      await waitFor(
        () => {
          expect(screen.getByTestId('quote-success-card')).toBeInTheDocument()
        },
        { timeout: 1500 }
      )

      expect(screen.getByText(/Enquiry Received Successfully!/i)).toBeInTheDocument()
      expect(screen.getByText(/Fatima Zahra/i)).toBeInTheDocument()
      expect(screen.getByText(/VNI-REQ-/i)).toBeInTheDocument()
      expect(screen.getAllByText(/mayur\.isamaliya@vniexport\.com/i).length).toBeGreaterThan(0)
    })

    it('renders red required asterisk immediately next to required field labels and not on optional fields', () => {
      render(<HomePage />)
      const form = screen.getByTestId('quote-form')
      const labels = form.querySelectorAll('label.form-label')

      // Check required fields have .req star
      const requiredLabels = ['Name', 'Company and country', 'Email', 'Product and quantity']
      requiredLabels.forEach((fieldName) => {
        const label = Array.from(labels).find((l) => l.textContent?.includes(fieldName))
        expect(label).toBeDefined()
        const reqStar = label?.querySelector('.req')
        expect(reqStar).toBeInTheDocument()
        expect(reqStar?.textContent).toBe('*')
      })

      // Check optional fields do not have .req star
      const optionalLabels = ['Preferred Incoterm', 'Destination Seaport', 'Message']
      optionalLabels.forEach((fieldName) => {
        const label = Array.from(labels).find((l) => l.textContent?.includes(fieldName))
        expect(label).toBeDefined()
        const reqStar = label?.querySelector('.req')
        expect(reqStar).toBeNull()
      })
    })

    it('verifies form-label CSS places required red star close to label text instead of space-between end-side', async () => {
      const fs = await import('node:fs')
      const path = await import('node:path')
      const cssContent = fs.readFileSync(path.resolve(process.cwd(), 'src/styles.css'), 'utf-8')

      // .form-label should use justify-content: flex-start and not space-between
      expect(cssContent).toMatch(/\.form-label\s*\{[^}]*justify-content:\s*flex-start/i)
      expect(cssContent).not.toMatch(/\.form-label\s*\{[^}]*justify-content:\s*space-between/i)

      // .form-label .req should use red error color
      expect(cssContent).toMatch(/\.form-label\s+\.req\s*\{[^}]*color:\s*var\(--color-error\)/i)
    })
  })

  describe('8. FAQ Accordion & Verification', () => {
    it('toggles FAQ questions and verifies Incoterms & MOQ answers', () => {
      render(<HomePage />)
      // Incoterm answer is initially open (index 0)
      expect(
        screen.getByText(/CIF \(Cost, Insurance & Freight\), CIP \(Carriage & Insurance Paid to\), FOB/i)
      ).toBeInTheDocument()

      const moqQuestion = screen.getByText(/What is your Minimum Order Quantity \(MOQ\)\?/i)
      fireEvent.click(moqQuestion)

      expect(screen.getAllByText(/By Sea: 20 ft container/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/By Air: 1 ton via Mumbai \(by Air\)/i).length).toBeGreaterThan(0)
    })
  })

  describe('9. Preferred Incoterm (Delivery Terms) Dropdown & Sequence', () => {
    it('renders Preferred Incoterm (Delivery Terms) label and select element', () => {
      render(<HomePage />)
      const select = screen.getByLabelText(/Preferred Incoterm \(Delivery Terms\)/i)
      expect(select).toBeInTheDocument()
      expect(select.tagName.toLowerCase()).toBe('select')
    })

    it('renders all 6 Incoterm options in the exact step-by-step sequence', () => {
      render(<HomePage />)
      const select = screen.getByLabelText(/Preferred Incoterm \(Delivery Terms\)/i) as HTMLSelectElement
      const options = Array.from(select.options)

      expect(options).toHaveLength(6)

      const expectedSequence = [
        { value: 'EXW', text: 'EXW (Ex Works – Surat Packhouse)' },
        { value: 'FCA', text: 'FCA (Free Carrier – Surat / Mumbai Airport)' },
        { value: 'FOB', text: 'FOB (Free on Board – Hazira / Mundra / JNPT)' },
        { value: 'CFR', text: 'CFR (Cost & Freight – sea)' },
        { value: 'CIF', text: 'CIF (Cost, Insurance & Freight – sea)' },
        { value: 'CIP', text: 'CIP (Carriage & Insurance Paid To – any mode)' },
      ]

      expectedSequence.forEach((expected, index) => {
        expect(options[index].value).toBe(expected.value)
        expect(options[index].textContent?.trim()).toBe(expected.text)
      })
    })

    it('defaults to EXW (the first option in sequence)', () => {
      render(<HomePage />)
      const select = screen.getByLabelText(/Preferred Incoterm \(Delivery Terms\)/i) as HTMLSelectElement
      expect(select.value).toBe('EXW')
    })

    it('allows changing between each of the 6 Incoterm options', () => {
      render(<HomePage />)
      const select = screen.getByLabelText(/Preferred Incoterm \(Delivery Terms\)/i) as HTMLSelectElement

      const codes = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CIP']
      codes.forEach((code) => {
        fireEvent.change(select, { target: { value: code } })
        expect(select.value).toBe(code)
      })
    })

    it('submits form with custom Incoterm (CIP) and displays it on confirmation voucher', async () => {
      render(<HomePage />)
      const nameInput = screen.getByLabelText(/^Name/i)
      const companyInput = screen.getByLabelText(/Company and country/i)
      const contactInput = screen.getByLabelText(/^Email/i, { selector: 'input' })
      const productInput = screen.getByLabelText(/Product and quantity/i)
      const incotermSelect = screen.getByLabelText(/Preferred Incoterm \(Delivery Terms\)/i)
      const portInput = screen.getByLabelText(/Destination Seaport/i)

      fireEvent.change(nameInput, { target: { value: 'Ahmed Al Mansoori' } })
      fireEvent.change(companyInput, { target: { value: 'Gulf Agro Trading LLC, Oman' } })
      fireEvent.change(contactInput, { target: { value: 'ahmed@gulfagro.om' } })
      fireEvent.change(productInput, { target: { value: 'Soyabean Non-GMO, 2 x 20ft FCL' } })
      fireEvent.change(incotermSelect, { target: { value: 'CIP' } })
      fireEvent.change(portInput, { target: { value: 'Sohar Port' } })

      const submitBtn = screen.getByRole('button', { name: /Send Export Enquiry/i })
      fireEvent.click(submitBtn)

      let successCard: HTMLElement | null = null
      await waitFor(() => {
        successCard = screen.getByTestId('quote-success-card')
        expect(successCard).toBeInTheDocument()
      })

      expect(within(successCard!).getByText(/CIP/)).toBeInTheDocument()
      expect(within(successCard!).getByText(/Sohar Port/)).toBeInTheDocument()
    })
  })

  describe('10. SEO & Brand Discoverability Optimization', () => {
    it('renders single h1 containing brand name VNI Export & Import and location', () => {
      render(<HomePage />)
      const h1s = screen.getAllByRole('heading', { level: 1 })
      expect(h1s).toHaveLength(1)
      expect(h1s[0].textContent).toContain('VNI Export & Import')
      expect(h1s[0].textContent).toContain('Surat, Gujarat')
      expect(h1s[0].textContent).toContain('Indian fruits, vegetables, pulses & spices')
    })

    it('renders official brand logo emblem on the front hero section and header', () => {
      render(<HomePage />)
      const logos = screen.getAllByLabelText(/VNI logo mark/i)
      expect(logos.length).toBeGreaterThanOrEqual(2) // At least header, hero front, footer
    })
  })
})

