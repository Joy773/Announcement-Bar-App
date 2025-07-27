import {
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";

export default function AnnouncementBar() {
  const [value, setValue] = useState("Add your text here");
  const [color, setColor] = useState("#000000");
  const [buttonColor, setButtonColor] = useState("#008060");
  const [barBgColor, setBarBgColor] = useState("#f4f6f8");

  const handleChange = useCallback((newValue) => setValue(newValue), []);
  const handleColorChange = useCallback((event) => setColor(event.target.value), []);
  const handleButtonColorChange = useCallback((event) => setButtonColor(event.target.value), []);
  const handleBarBgColorChange = useCallback((event) => setBarBgColor(event.target.value), []);

  return (
    <Page>
      <TitleBar title="Announcement Bar" />
      <Layout>
        <Layout.Section>
          <TextField
            label="Bar Title"
            value={value}
            onChange={handleChange}
            autoComplete="off"
            style={{ maxWidth: 250 }}
          />
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center' }}>
            <label htmlFor="shop-now-button-color-picker" style={{ marginRight: 8 }}>
              Shop Now Button Color
            </label>
            <input
              id="shop-now-button-color-picker"
              type="color"
              value={buttonColor}
              onChange={handleButtonColorChange}
              style={{ width: 28, height: 24, border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
              title="Pick Shop Now button background color"
            />
            <label htmlFor="bar-bg-color-picker" style={{ marginLeft: 24, marginRight: 8 }}>
              Bar Background Color
            </label>
            <input
              id="bar-bg-color-picker"
              type="color"
              value={barBgColor}
              onChange={handleBarBgColorChange}
              style={{ width: 28, height: 24, border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
              title="Pick announcement bar background color"
            />
            <label htmlFor="bar-title-color-picker" style={{ marginLeft: 24, marginRight: 8 }}>
              Bar Title Color
            </label>
            <input
              id="bar-title-color-picker"
              type="color"
              value={color}
              onChange={handleColorChange}
              style={{ width: 28, height: 24, border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
              title="Pick bar title text color"
            />
          </div>
        </Layout.Section>
        <Layout.Section>
          <div style={{
            marginTop: 24,
            padding: '12px 24px',
            background: barBgColor,
            borderRadius: 6,
            border: '1px solid #dfe3e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
          }}>
            <span style={{ color, fontWeight: 600, fontSize: 18, marginRight: 24 }}>
              {value}
            </span>
            {value.trim() && (
              <button
                style={{
                  background: buttonColor,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 20px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'background 0.2s',
                }}
                type="button"
              >
                Shop Now
              </button>
            )}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

