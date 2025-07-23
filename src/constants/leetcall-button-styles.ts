export const LEETCALL_BUTTON_STYLES = `
      .leetcall-button {
        padding: 0.25rem 0.5rem;
        font-size: 0.95rem;
        font-weight: 500;
        background: #ed8b3c;
        color: #fff;
        border: 1px solid #ed8b3c;
        border-radius: 6px;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        cursor: pointer;
        min-width: 65px;
        max-widhth: 65px;
        letter-spacing: 0.1px;
      }
      .leetcall-button:hover {
        background: #ffb877;
        color: #fff;
        border-color: #ed8b3c;
      }
      .leetcall-button:active {
        border-color: #ed8b3c;
        background: #e07a1a;
        color: #fff;
      }
      .leetcall-button:focus {
        outline: none;
        box-shadow: 0 0 0 2px #ffe5ca;
      }
      .leetcall-button-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #e5e7eb !important;
        color: #a1a1aa !important;
        border-color: #e5e7eb !important;
      }
    `;
