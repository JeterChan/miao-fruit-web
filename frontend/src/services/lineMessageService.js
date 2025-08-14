// LINE Message Service - Handles creation of various LINE message formats

export class LineMessageService {
  
  // Create order confirmation Flex Message
  static createOrderConfirmationMessage(orderData, cart, totalItems, totalPrice) {
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
            size: "md",
            color: "#666666"
          }
        ],
        backgroundColor: "#FFF8F0",
        paddingAll: "20px"
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          this._createOrderNumberSection(orderData.orderNumber),
          this._createSeparator(),
          this._createRecipientInfoSection(orderData),
          this._createSeparator(),
          this._createOrderItemsSection(cart, totalItems, totalPrice)
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "🍐 感謝您的訂購！我們會盡快為您處理訂單。",
            size: "sm",
            color: "#666666",
            align: "center",
            wrap: true
          },
          {
            type: "text",
            text: "如有問題請聯絡：0910-567118",
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
  static createOrderConfirmationText(orderData, cart, totalItems, totalPrice) {
    return `🍐 妙媽媽果園訂單確認

訂單編號：${orderData.orderNumber}
收件人：${orderData.receiverName} (${orderData.receiverPhone})
收件地址：${orderData.receiverAddress}

訂購商品：
${cart.map(item => `• ${item.grade} x ${item.cartQuantity}盒 - NT$${(item.price * item.cartQuantity).toLocaleString()}`).join('\n')}

總計：${totalItems}盒 - NT$${totalPrice.toLocaleString()}

感謝您的訂購！我們會盡快為您處理訂單。
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

  static _createOrderItemsSection(cart, totalItems, totalPrice) {
    return {
      type: "box",
      layout: "vertical",
      margin: "md",
      contents: [
        {
          type: "text",
          text: "訂購商品",
          weight: "bold",
          size: "sm",
          color: "#FF6B35"
        },
        ...cart.map(item => this._createOrderItemRow(item)),
        this._createSeparator(),
        this._createTotalRow(totalItems, totalPrice)
      ]
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