frappe.provide("frappe.ui.form");

frappe.ui.form.ItemQuickEntryForm = class ItemQuickEntryForm extends frappe.ui.form.QuickEntryForm {
	constructor(doctype, after_insert, init_callback, doc, force) {
		super(doctype, after_insert, init_callback, doc, force);
	}

	get_title() {
		return __("إضافة صنف جديد");
	}

	set_meta_and_mandatory_fields() {
		super.set_meta_and_mandatory_fields();

		// Ensure defaults for new local item
		if (this.doc) {
			if (this.doc.is_sales_item === undefined) this.doc.is_sales_item = 1;
			if (this.doc.is_purchase_item === undefined) this.doc.is_purchase_item = 1;
			if (this.doc.is_stock_item === undefined) this.doc.is_stock_item = 1;
		}

		const find_field = (fieldname) => {
			let f = (this.docfields || []).find((df) => df.fieldname === fieldname);
			if (!f && this.meta && this.meta.fields) {
				f = this.meta.fields.find((df) => df.fieldname === fieldname);
			}
			return f;
		};

		// 1. Basic Details
		const f_item_code = find_field("item_code");
		const f_item_name = find_field("item_name");
		const f_item_group = find_field("item_group");
		const f_stock_uom = find_field("stock_uom");

		// 2. Stock and Asset Options
		const f_is_stock_item = find_field("is_stock_item");
		const f_is_fixed_asset = find_field("is_fixed_asset");

		// 3. Pricing and Cost
		const f_standard_rate = find_field("standard_rate");
		const f_purchase_cost = find_field("purchase_cost");
		const f_opening_stock = find_field("opening_stock");

		// Structured 3-section layout matching Afaq Pro design
		const structured = [
			// --- Section 1: Basic Details (4 fields in one row on desktop) ---
			{
				fieldtype: "Section Break",
				label: __("البيانات الأساسية"),
				fieldname: "section_basic_details",
			},
			f_item_code,
			{ fieldtype: "Column Break" },
			f_item_name,
			{ fieldtype: "Column Break" },
			f_item_group,
			{ fieldtype: "Column Break" },
			f_stock_uom,

			// --- Section 2: Stock and Asset Options (Checkboxes preserved as native) ---
			{
				fieldtype: "Section Break",
				label: __("خيارات المخزون والأصول"),
				fieldname: "section_stock_asset",
			},
			f_is_stock_item,
			{ fieldtype: "Column Break" },
			f_is_fixed_asset,

			// --- Section 3: Pricing and Cost (3 fields in one row on desktop) ---
			{
				fieldtype: "Section Break",
				label: __("الأسعار والتكلفة"),
				fieldname: "section_pricing_cost",
			},
			f_standard_rate,
			{ fieldtype: "Column Break" },
			f_purchase_cost,
			{ fieldtype: "Column Break" },
			f_opening_stock,
		].filter(Boolean);

		this.docfields = structured;
	}

	render_dialog() {
		this.inject_custom_styles();
		super.render_dialog();

		// Add custom class and expand dialog width
		if (this.dialog && this.dialog.$wrapper) {
			this.dialog.$wrapper.find(".modal-dialog").addClass("modal-xl item-quick-entry-modal-dialog");

			// Add green plus icon to title
			const $title = this.dialog.$wrapper.find(".modal-title");
			if ($title.length && !$title.find(".afaq-plus-icon").length) {
				const plus_svg = `
					<svg class="afaq-plus-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-inline-end: 8px; display: inline-block;">
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="12" y1="8" x2="12" y2="16"></line>
						<line x1="8" y1="12" x2="16" y2="12"></line>
					</svg>
				`;
				$title.prepend(plus_svg);
			}

			// Decorate section headers with #012354 and icons
			this.decorate_section_headers();
		}

		// Preserve original query filters
		this.set_query("item_group", () => ({ filters: { is_group: 0 } }));
	}

	decorate_section_headers() {
		const $wrapper = this.dialog.$wrapper;

		const icon_basic = `
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#012354" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-inline-end: 8px; display: inline-block;">
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
				<line x1="3" y1="9" x2="21" y2="9"></line>
				<line x1="9" y1="21" x2="9" y2="9"></line>
			</svg>
		`;
		const icon_stock = `
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#012354" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-inline-end: 8px; display: inline-block;">
				<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
				<polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
				<line x1="12" y1="22.08" x2="12" y2="12"></line>
			</svg>
		`;
		const icon_pricing = `
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#012354" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-inline-end: 8px; display: inline-block;">
				<circle cx="12" cy="12" r="10"></circle>
				<path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
				<line x1="12" y1="6" x2="12" y2="8"></line>
				<line x1="12" y1="16" x2="12" y2="18"></line>
			</svg>
		`;

		const map = [
			{ key: "section_basic_details", icon: icon_basic },
			{ key: "section_stock_asset", icon: icon_stock },
			{ key: "section_pricing_cost", icon: icon_pricing },
		];

		map.forEach(({ key, icon }) => {
			const $sec = $wrapper.find(`[data-fieldname="${key}"]`);
			const $head = $sec.find(".section-head, .section-title, .collapse-indicator");
			if ($head.length && !$head.find("svg").length) {
				$head.prepend(icon);
			}
		});
	}

	inject_custom_styles() {
		const style_id = "afaqpro-item-quick-entry-styles";
		if (document.getElementById(style_id)) return;

		const css = `
			.item-quick-entry-modal-dialog {
				max-width: 1100px !important;
			}
			.item-quick-entry-modal-dialog .modal-content {
				border-radius: 12px !important;
				border: 1px solid #e2e8f0 !important;
				background-color: #ffffff !important;
				box-shadow: 0 12px 30px -10px rgba(1, 35, 84, 0.12) !important;
			}
			.item-quick-entry-modal-dialog .modal-header {
				padding: 16px 24px !important;
				border-bottom: 1px solid #f1f5f9 !important;
			}
			.item-quick-entry-modal-dialog .modal-title {
				font-size: 1.15rem !important;
				font-weight: 700 !important;
				color: #012354 !important;
				display: flex !important;
				align-items: center !important;
			}
			.item-quick-entry-modal-dialog .form-section {
				border-bottom: none !important;
				margin-bottom: 8px !important;
				padding-bottom: 4px !important;
			}
			.item-quick-entry-modal-dialog .section-head {
				color: #012354 !important;
				font-weight: 700 !important;
				font-size: 0.95rem !important;
				display: flex !important;
				align-items: center !important;
				margin-bottom: 12px !important;
				padding-bottom: 6px !important;
				border-bottom: 1px solid #f1f5f9 !important;
			}
			.item-quick-entry-modal-dialog .form-control {
				border: 1px solid #cbd5e1 !important;
				border-radius: 6px !important;
				font-size: 0.88rem !important;
				height: 38px !important;
				background-color: #ffffff !important;
				color: #1e293b !important;
				transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
			}
			.item-quick-entry-modal-dialog .form-control:focus {
				border-color: #012354 !important;
				box-shadow: 0 0 0 3px rgba(1, 35, 84, 0.12) !important;
			}
			.item-quick-entry-modal-dialog .control-label {
				font-size: 0.82rem !important;
				font-weight: 600 !important;
				color: #334155 !important;
				margin-bottom: 4px !important;
			}
			.item-quick-entry-modal-dialog .help-box {
				font-size: 0.74rem !important;
				color: #64748b !important;
				margin-top: 4px !important;
				line-height: 1.35 !important;
			}
			.item-quick-entry-modal-dialog .modal-footer {
				padding: 12px 24px !important;
				border-top: 1px solid #f1f5f9 !important;
				background-color: #ffffff !important;
			}
			.item-quick-entry-modal-dialog .modal-footer .btn-primary {
				background-color: #10b981 !important;
				border-color: #10b981 !important;
				color: #ffffff !important;
				font-weight: 600 !important;
				padding: 7px 22px !important;
				border-radius: 6px !important;
			}
			.item-quick-entry-modal-dialog .modal-footer .btn-primary:hover {
				background-color: #059669 !important;
				border-color: #059669 !important;
			}
			.item-quick-entry-modal-dialog .modal-footer .btn-secondary,
			.item-quick-entry-modal-dialog .modal-footer .btn-default {
				background-color: #f8fafc !important;
				border: 1px solid #cbd5e1 !important;
				color: #475569 !important;
				font-weight: 500 !important;
				padding: 7px 18px !important;
				border-radius: 6px !important;
			}
			.item-quick-entry-modal-dialog .modal-footer .btn-secondary:hover,
			.item-quick-entry-modal-dialog .modal-footer .btn-default:hover {
				background-color: #f1f5f9 !important;
				color: #0f172a !important;
			}
			@media (max-width: 767px) {
				.item-quick-entry-modal-dialog {
					max-width: 95% !important;
					margin: 10px auto !important;
				}
				.item-quick-entry-modal-dialog .col-sm-3,
				.item-quick-entry-modal-dialog .col-sm-4,
				.item-quick-entry-modal-dialog .col-sm-6 {
					width: 100% !important;
				}
			}
		`;

		const style = document.createElement("style");
		style.id = style_id;
		style.type = "text/css";
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	}
};
