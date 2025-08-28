// LINE Message Service - Handles creation of various LINE message formats

export class LineMessageService {
  
  // Create order confirmation Flex Message
  static createOrderConfirmationMessage(orderData, cart, totalItems, totalPrice, shippingFee = null) {
    return {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "妙媽媽果園",
            weight: "bold",
            size: "xl",
            color: "#FF6B35"
          },
          {
            type: "text",
            text: "訂單確認通知",
            
          },
          this._createOrderNumberSection(orderData.orderNumber),
        ],
        backgroundColor: "#FFF8F0",
        paddingAll: "20px"
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          this._createSeparator(),
          this._createSenderInfoSection(orderData),
          this._createSeparator(),
          this._createRecipientInfoSection(orderData),
          this._createSeparator(),
          this._createOrderItemsSection(cart, totalItems, totalPrice, shippingFee),
          this._createSeparator(),
          this._createBankAccountSection(),
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "感謝您的訂購！我們會在收到匯款後1~3個工作天出貨。",
            size: "sm",
            color: "#666666",
            align: "center",
            wrap: true
          },
          {
            type: "text",
            text: "如有問題請透過官方帳號聯絡我們！",
            size: "xs",
            color: "#999999",
            align: "center",
            margin: "sm"
          }
        ],
        backgroundColor: "#FFF8F0",
        paddingAll: "12px"
      }
    };
  }

  // Create simple text order confirmation
  static createOrderConfirmationText(orderData, cart, totalItems, totalPrice, shippingFee = null) {
    return `🍐 妙媽媽果園詢價單確認

    詢價單編號：${orderData.orderNumber}

    寄件人：${orderData.senderName} (${orderData.senderPhone})
    寄件地址：${orderData.senderAddress}

    收件人：${orderData.receiverName} (${orderData.receiverPhone})
    收件地址：${orderData.receiverAddress}

    訂購商品：
    ${cart.map(item => `• ${item.grade} x ${item.cartQuantity}盒 - NT$${(item.price * item.cartQuantity).toLocaleString()}`).join('\n')}

    小計：NT$${(totalPrice - (shippingFee || 0)).toLocaleString()}${shippingFee !== null ? `
    運費：${shippingFee === 0 ? '免運費' : `NT$${shippingFee.toLocaleString()}`}` : ''}
    總計：${totalItems}盒 - NT$${totalPrice.toLocaleString()}

    💰 付款方式 轉帳匯款/現金支付
    中華郵政(代碼700)
    卓蘭郵局
    戶名：劉芳妙
    帳號：0291377-0159424

    ※ 匯款完成後，請務必告知
    「匯款帳號末5碼」及「匯款金額」。

    📋 後續流程說明：
    1️⃣ 我們會立即為您確認商品庫存
    2️⃣ 確認庫存後會提供付款方式資訊
    3️⃣ 同時寄送最終的訂單確認表

    ⚠️ 重要提醒：此為詢價單，不會立即扣款

    感謝您的詢價！我們會盡快為您確認庫存。
    如有問題請聯絡：0910-567118`;
  }

  // Private helper methods
  static _createOrderNumberSection(orderNumber) {
    return {
      type: "text",
      text: `訂單編號：${orderNumber}`,
      weight: "bold",
      size: "md",
      color: "#333333",
      margin: "md"
    };
  }

  static _createSeparator() {
    return {
      type: "separator",
      margin: "md"
    };
  }

  static _createSenderInfoSection(orderData) {
    return {
      type: "box",
      layout: "vertical",
      margin: "md",
      contents: [
        {
          type: "text",
          text: "寄件資訊",
          weight: "bold",
          size: "sm",
          color: "#FF6B35"
        },
        {
          type: "text",
          text: `姓名：${orderData.senderName}`,
          size: "sm",
          color: "#555555",
          margin: "xs"
        },
        {
          type: "text",
          text: `電話：${orderData.senderPhone}`,
          size: "sm",
          color: "#555555",
          margin: "xs"
        },
        {
          type: "text",
          text: `地址：${orderData.senderAddress}`,
          size: "sm",
          color: "#555555",
          margin: "xs",
          wrap: true
        }
      ]
    };
  }

  static _createRecipientInfoSection(orderData) {
    return {
      type: "box",
      layout: "vertical",
      margin: "md",
      contents: [
        {
          type: "text",
          text: "收件資訊",
          weight: "bold",
          size: "sm",
          color: "#FF6B35"
        },
        {
          type: "text",
          text: `姓名：${orderData.receiverName}`,
          size: "sm",
          color: "#555555",
          margin: "xs"
        },
        {
          type: "text",
          text: `電話：${orderData.receiverPhone}`,
          size: "sm",
          color: "#555555",
          margin: "xs"
        },
        {
          type: "text",
          text: `地址：${orderData.receiverAddress}`,
          size: "sm",
          color: "#555555",
          margin: "xs",
          wrap: true
        }
      ]
    };
  }

  static _createOrderItemsSection(cart, totalItems, totalPrice, shippingFee = null) {
    const subtotal = shippingFee !== null ? totalPrice - shippingFee : totalPrice;
    
    const contents = [
      {
        type: "text",
        text: "訂購商品",
        weight: "bold",
        size: "sm",
        color: "#FF6B35"
      },
      ...cart.map(item => this._createOrderItemRow(item)),
      this._createSeparator()
    ];

    // Add subtotal if shipping fee is available
    if (shippingFee !== null) {
      contents.push(this._createSubtotalRow(subtotal));
      contents.push(this._createShippingRow(shippingFee));
      contents.push(this._createSeparator());
    }

    contents.push(this._createTotalRow(totalItems, totalPrice));

    return {
      type: "box",
      layout: "vertical",
      margin: "md",
      contents: contents
    };
  }

  static _createOrderItemRow(item) {
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: item.grade,
          size: "sm",
          color: "#555555",
          flex: 3
        },
        {
          type: "text",
          text: `${item.cartQuantity}盒`,
          size: "sm",
          color: "#555555",
          align: "end",
          flex: 1
        },
        {
          type: "text",
          text: `NT$${(item.price * item.cartQuantity).toLocaleString()}`,
          size: "sm",
          color: "#333333",
          align: "end",
          weight: "bold",
          flex: 2
        }
      ],
      margin: "xs"
    };
  }

  static _createSubtotalRow(subtotal) {
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: "商品小計",
          size: "sm",
          color: "#555555"
        },
        {
          type: "text",
          text: `NT$${subtotal.toLocaleString()}`,
          size: "sm",
          color: "#333333",
          align: "end",
          weight: "bold"
        }
      ],
      margin: "xs"
    };
  }

  static _createShippingRow(shippingFee) {
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: "運費",
          size: "sm",
          color: "#555555"
        },
        {
          type: "text",
          text: shippingFee === 0 ? "免運費" : `NT$${shippingFee.toLocaleString()}`,
          size: "sm",
          color: shippingFee === 0 ? "#4CAF50" : "#333333",
          align: "end",
          weight: "bold"
        }
      ],
      margin: "xs"
    };
  }

  static _createTotalRow(totalItems, totalPrice) {
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: `共 ${totalItems} 盒`,
          size: "md",
          color: "#333333",
          weight: "bold"
        },
        {
          type: "text",
          text: `NT$${totalPrice.toLocaleString()}`,
          size: "md",
          color: "#FF6B35",
          align: "end",
          weight: "bold"
        }
      ],
      margin: "md"
    };
  }

  static _createBankAccountSection() {
    return {
      type: "box",
      layout: "vertical",
      margin: "md",
      contents: [
        {
          type: "text",
          text: "💰 付款方式 轉帳匯款/現金支付",
          weight: "bold",
          size: "sm",
          color: "#FF6B35"
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "中華郵政(代碼700)",
              size: "sm",
              color: "#333333",
              margin: "xs",
              weight: "bold"
            },
            {
              type: "text",
              text: "卓蘭郵局",
              size: "sm",
              color: "#555555",
              margin: "xs"
            },
            {
              type: "text",
              text: "戶名：劉芳妙",
              size: "sm",
              color: "#555555",
              margin: "xs"
            },
            {
              type: "text",
              text: "帳號：0291377-0159424",
              size: "sm",
              color: "#333333",
              margin: "xs",
              weight: "bold"
            }
          ],
          backgroundColor: "#FFF8F0",
          paddingAll: "12px",
          cornerRadius: "8px",
          margin: "sm"
        },
        {
          type: "text",
          text: "※ 匯款完成後，請務必告知\n「匯款帳號末5碼」及「匯款金額」。",
          size: "xs",
          color: "#E65100",
          wrap: true,
          margin: "sm"
        }
      ]
    };
  }

  static _createInquirementSection() {
    return {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: "📋 後續流程說明：",
          weight: "bold",
          size: "md",
          color: "#FF6B35"
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
          contents: [
            {
              type: "text",
              text: "1️⃣ 我們會立即為您確認商品庫存",
              size: "sm",
              color: "#666666",
              wrap: true
            },
            {
              type: "text",
              text: "2️⃣ 確認庫存後會提供付款方式資訊",
              size: "sm",
              color: "#666666",
              wrap: true
            },
            {
              type: "text",
              text: "3️⃣ 同時寄送最終的訂單確認表",
              size: "sm",
              color: "#666666",
              wrap: true
            }
          ]
        },
        {
          type: "separator",
          margin: "md"
        },
        {
          type: "box",
          layout: "horizontal",
          spacing: "sm",
          margin: "md",
          contents: [
            {
              type: "text",
              text: "⚠️",
              size: "sm",
              flex: 0
            },
            {
              type: "text",
              text: "重要提醒：此為詢價單，不會立即扣款",
              size: "sm",
              color: "#FF6B35",
              weight: "bold",
              wrap: true,
              flex: 1
            }
          ]
        }
      ]
    };
  }

  // Create other message types
  static createWelcomeMessage(userName) {
    return {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `歡迎 ${userName}！`,
            weight: "bold",
            size: "lg",
            color: "#FF6B35"
          },
          {
            type: "text",
            text: "感謝您使用妙媽媽果園訂購系統",
            size: "sm",
            color: "#666666",
            margin: "md",
            wrap: true
          }
        ]
      }
    };
  }

  static createTestMessage() {
    return {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "🍐 測試訊息",
            weight: "bold",
            size: "lg",
            color: "#FF6B35"
          },
          {
            type: "text",
            text: "這是來自妙媽媽果園的測試訊息！系統運作正常。",
            size: "sm",
            color: "#666666",
            margin: "md",
            wrap: true
          }
        ]
      }
    };
  }
}