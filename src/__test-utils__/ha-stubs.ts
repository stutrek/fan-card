/**
 * Lightweight stand-ins for the Home Assistant custom elements used by cards.
 * These do NOT match HA's real behavior; they exist so cards can render in
 * Storybook and tests without console errors about unknown elements.
 */

if (typeof customElements !== 'undefined' && !customElements.get('ha-card')) {
  class HaCardStub extends HTMLElement {
    connectedCallback() {
      this.style.display = 'block';
      this.style.background = 'var(--ha-card-background, var(--card-background-color, #1c1c1c))';
      this.style.color = 'var(--primary-text-color, #e1e1e1)';
      this.style.borderRadius = 'var(--ha-card-border-radius, 12px)';
      this.style.overflow = 'hidden';
      this.style.padding = '0';
    }
  }
  customElements.define('ha-card', HaCardStub);
}

if (typeof customElements !== 'undefined' && !customElements.get('ha-select')) {
  class HaSelectStub extends HTMLElement {
    private _select: HTMLSelectElement;

    constructor() {
      super();
      this._select = document.createElement('select');
      this._select.style.padding = '8px';
      this._select.style.width = '100%';
      this._select.addEventListener('change', (e) => {
        this.dispatchEvent(
          new CustomEvent('change', {
            detail: { value: (e.target as HTMLSelectElement).value },
            bubbles: true,
          }),
        );
      });
    }

    connectedCallback() {
      this.style.display = 'block';
      this.style.margin = '8px 0';

      const label = this.getAttribute('label');
      if (label) {
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.display = 'block';
        labelEl.style.marginBottom = '4px';
        this.appendChild(labelEl);
      }

      // Move ha-list-item children into the native select.
      const items = Array.from(this.querySelectorAll('ha-list-item'));
      for (const item of items) {
        const opt = document.createElement('option');
        opt.value = item.getAttribute('value') ?? '';
        opt.textContent = item.textContent ?? '';
        this._select.appendChild(opt);
        item.remove();
      }

      this.appendChild(this._select);

      const value = this.getAttribute('value');
      if (value) this._select.value = value;
    }

    set value(v: string) {
      this._select.value = v;
    }

    get value() {
      return this._select.value;
    }
  }
  customElements.define('ha-select', HaSelectStub);
}

if (typeof customElements !== 'undefined' && !customElements.get('ha-list-item')) {
  // ha-list-item only exists as a child of ha-select; it gets moved into the
  // native <select> during connectedCallback. The bare element just hides itself.
  class HaListItemStub extends HTMLElement {
    connectedCallback() {
      this.style.display = 'none';
    }
  }
  customElements.define('ha-list-item', HaListItemStub);
}

if (typeof customElements !== 'undefined' && !customElements.get('ha-icon')) {
  // Tiny inline mapping for icons commonly used in this card's stories. In a
  // real HA install <ha-icon> looks up Material Design Icons by name.
  const ICON_PATHS: Record<string, string> = {
    'mdi:fan':
      'M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z',
    'mdi:fan-off':
      'M12.5,2C9.64,2 8.57,4.55 9.29,7.47L15,13.16C15.87,13.37 16.81,13.81 17.28,14.73C18.46,17.1 22.03,17 22.03,12.5C22.03,8.92 18.05,8.13 14.35,10.13C14.03,9.73 13.61,9.42 13.13,9.22C13.32,8.29 13.76,7.24 14.75,6.75C17.11,5.57 17,2 12.5,2M3.28,4L2,5.27L4.47,7.73C3.22,7.74 2,8.87 2,11.5C2,15.07 5.96,15.85 9.65,13.87C9.97,14.27 10.4,14.59 10.89,14.79C10.69,15.71 10.25,16.75 9.27,17.24C6.91,18.42 7,22 11.5,22C13.8,22 14.94,20.36 14.94,18.21L18.73,22L20,20.72L3.28,4Z',
  };

  class HaIconStub extends HTMLElement {
    static get observedAttributes() {
      return ['icon'];
    }
    connectedCallback() {
      this.style.display = 'inline-flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this._render();
    }
    attributeChangedCallback() {
      this._render();
    }
    private _render() {
      const icon = this.getAttribute('icon') ?? '';
      const path = ICON_PATHS[icon];
      if (path) {
        const size = getComputedStyle(this).getPropertyValue('--mdc-icon-size').trim() || '24px';
        this.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor"><path d="${path}"/></svg>`;
      } else {
        this.textContent = icon || '●';
      }
    }
  }
  customElements.define('ha-icon', HaIconStub);
}

if (typeof customElements !== 'undefined' && !customElements.get('ha-textfield')) {
  class HaTextfieldStub extends HTMLElement {
    private _input: HTMLInputElement;

    constructor() {
      super();
      this._input = document.createElement('input');
      this._input.type = 'text';
      this._input.style.padding = '8px';
      this._input.style.width = '100%';
      this._input.addEventListener('input', (e) => {
        this.dispatchEvent(
          new CustomEvent('input', {
            detail: { value: (e.target as HTMLInputElement).value },
            bubbles: true,
          }),
        );
      });
    }

    connectedCallback() {
      this.style.display = 'block';
      this.style.margin = '8px 0';

      const label = this.getAttribute('label');
      if (label) {
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.display = 'block';
        labelEl.style.marginBottom = '4px';
        this.appendChild(labelEl);
      }

      this.appendChild(this._input);

      const value = this.getAttribute('value');
      if (value) this._input.value = value;
    }

    set value(v: string) {
      this._input.value = v;
    }

    get value() {
      return this._input.value;
    }
  }
  customElements.define('ha-textfield', HaTextfieldStub);
}

export {};
