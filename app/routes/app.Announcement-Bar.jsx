import {
  Layout,
  Page,
  TextField,
  ButtonGroup,
  Button,
  Toast,
  Frame,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  // Get existing metafields
  const response = await admin.graphql(
    `#graphql
      query getAnnouncementBarMetafields {
        shop {
          metafields(namespace: "announcement_bar", first: 10) {
            edges {
              node {
                id
                key
                value
              }
            }
          }
        }
      }`
  );
  
  const responseJson = await response.json();
  const metafields = responseJson.data.shop.metafields.edges;
  
  // Extract values from metafields
  const announcementData = {};
  metafields.forEach(({ node }) => {
    announcementData[node.key] = node.value;
  });
  
  return json({
    announcementData: {
      title: announcementData.title || "Add your text here",
      color: announcementData.color || "#000000",
      buttonColor: announcementData.buttonColor || "#008060",
      barBgColor: announcementData.barBgColor || "#f4f6f8",
    }
  });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  
  // Get shop info first
  const shopResponse = await admin.graphql(
    `#graphql
      query getShop {
        shop {
          id
        }
      }`
  );
  
  const shopData = await shopResponse.json();
  const shopId = shopData.data.shop.id;
  
  const title = formData.get("title");
  const color = formData.get("color");
  const buttonColor = formData.get("buttonColor");
  const barBgColor = formData.get("barBgColor");
  
  try {
    // Save metafields
    const response = await admin.graphql(
      `#graphql
        mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }`,
      {
        variables: {
          metafields: [
            {
              namespace: "announcement_bar",
              key: "title",
              type: "single_line_text_field",
              value: title,
              ownerId: shopId
            },
            {
              namespace: "announcement_bar",
              key: "color",
              type: "single_line_text_field",
              value: color,
              ownerId: shopId
            },
            {
              namespace: "announcement_bar",
              key: "buttonColor",
              type: "single_line_text_field",
              value: buttonColor,
              ownerId: shopId
            },
            {
              namespace: "announcement_bar",
              key: "barBgColor",
              type: "single_line_text_field",
              value: barBgColor,
              ownerId: shopId
            }
          ]
        }
      }
    );
    
    const responseJson = await response.json();
    
    console.log('Metafields response:', responseJson);
    
    if (responseJson.data.metafieldsSet.userErrors.length > 0) {
      return json({ 
        success: false, 
        error: responseJson.data.metafieldsSet.userErrors[0].message 
      });
    }
    
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: error.message });
  }
};

export default function AnnouncementBar() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [value, setValue] = useState(loaderData?.announcementData?.title || "Add your text here");
  const [color, setColor] = useState(loaderData?.announcementData?.color || "#000000");
  const [buttonColor, setButtonColor] = useState(loaderData?.announcementData?.buttonColor || "#008060");
  const [barBgColor, setBarBgColor] = useState(loaderData?.announcementData?.barBgColor || "#f4f6f8");
  const [showToast, setShowToast] = useState(false);

  const handleChange = useCallback((newValue) => setValue(newValue), []);
  const handleColorChange = useCallback((event) => setColor(event.target.value), []);
  const handleButtonColorChange = useCallback((event) => setButtonColor(event.target.value), []);
  const handleBarBgColorChange = useCallback((event) => setBarBgColor(event.target.value), []);

    // Show toast when action data changes
  useEffect(() => {
    if (actionData) {
      setShowToast(true);
    }
  }, [actionData]);

  return (
    <Frame>
      <Page>
        <TitleBar title="Announcement Bar" />
        <form method="post">
          <input type="hidden" name="title" value={value} />
          <input type="hidden" name="color" value={color} />
          <input type="hidden" name="buttonColor" value={buttonColor} />
          <input type="hidden" name="barBgColor" value={barBgColor} />
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
        <Layout.Section>
          <ButtonGroup>
            <Button type="button">Cancel</Button>
            <Button variant="primary" submit loading={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </ButtonGroup>
        </Layout.Section>
        </Layout>
        </form>
        {showToast && actionData && (
          <Toast
            content={actionData.success ? "Settings saved successfully!" : `Error: ${actionData.error}`}
            error={!actionData.success}
            onDismiss={() => setShowToast(false)}
          />
        )}
      </Page>
    </Frame>
  );
}

