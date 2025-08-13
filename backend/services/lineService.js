const { Client } = require('@line/bot-sdk');

class LineService {
  constructor() {
    this.config = {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    };
    
    if (this.config.channelAccessToken && this.config.channelSecret) {
      this.client = new Client(this.config);
    } else {
      console.warn('LINE credentials not configured. LINE messaging will be disabled.');
      this.client = null;
    }
  }

  isConfigured() {
    return this.client !== null;
  }

  async sendOrderConfirmation(userId, orderData) {
    if (!this.isConfigured()) {
      console.warn('LINE service not configured, skipping message');
      return;
    }

    const message = {
      type: 'flex',
      altText: 'Order Confirmation',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '🛒 Order Confirmed!',
              weight: 'bold',
              size: 'xl',
              color: '#ffffff'
            }
          ],
          backgroundColor: '#4CAF50',
          paddingAll: '20px'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: `Order #${orderData.id}`,
              weight: 'bold',
              size: 'lg',
              margin: 'md'
            },
            {
              type: 'separator',
              margin: 'md'
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'md',
              contents: [
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: 'Total Items:',
                      size: 'sm',
                      color: '#666666',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: orderData.items.length.toString(),
                      size: 'sm',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: 'Total Amount:',
                      size: 'sm',
                      color: '#666666',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: `$${orderData.total}`,
                      size: 'sm',
                      align: 'end',
                      weight: 'bold',
                      color: '#4CAF50'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: 'Status:',
                      size: 'sm',
                      color: '#666666',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: orderData.status || 'Confirmed',
                      size: 'sm',
                      align: 'end',
                      color: '#FF9800'
                    }
                  ]
                }
              ]
            },
            {
              type: 'separator',
              margin: 'md'
            },
            {
              type: 'text',
              text: 'Order Items:',
              weight: 'bold',
              size: 'md',
              margin: 'md'
            },
            ...orderData.items.map(item => ({
              type: 'box',
              layout: 'horizontal',
              margin: 'sm',
              contents: [
                {
                  type: 'text',
                  text: `${item.name} x${item.quantity}`,
                  size: 'sm',
                  color: '#666666',
                  flex: 0
                },
                {
                  type: 'text',
                  text: `$${(item.price * item.quantity).toFixed(2)}`,
                  size: 'sm',
                  align: 'end'
                }
              ]
            }))
          ],
          paddingAll: '20px'
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Thank you for your order! 🎉',
              size: 'sm',
              align: 'center',
              color: '#666666'
            }
          ],
          paddingAll: '10px'
        }
      }
    };

    try {
      await this.client.pushMessage(userId, message);
      console.log(`Order confirmation sent to user ${userId}`);
    } catch (error) {
      console.error('Failed to send LINE message:', error);
      throw error;
    }
  }

  async sendSimpleMessage(userId, text) {
    if (!this.isConfigured()) {
      console.warn('LINE service not configured, skipping message');
      return;
    }

    const message = {
      type: 'text',
      text: text
    };

    try {
      await this.client.pushMessage(userId, message);
      console.log(`Simple message sent to user ${userId}`);
    } catch (error) {
      console.error('Failed to send LINE message:', error);
      throw error;
    }
  }

  async sendFlexMessage(userId, altText, contents) {
    if (!this.isConfigured()) {
      console.warn('LINE service not configured, skipping message');
      return;
    }

    const message = {
      type: 'flex',
      altText: altText,
      contents: contents
    };

    try {
      await this.client.pushMessage(userId, message);
      console.log(`Flex message sent to user ${userId}`);
    } catch (error) {
      console.error('Failed to send LINE message:', error);
      throw error;
    }
  }
}

module.exports = new LineService();