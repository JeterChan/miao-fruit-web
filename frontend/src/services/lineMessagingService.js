import liffService from './liffService';

class LineMessagingService {
  
  async sendOrderDetailsViaMemo(orderData) {
    if (!liffService.isLoggedIn()) {
      throw new Error('User must be logged in to send messages');
    }

    const messages = [
      {
        type: 'text',
        text: `🛒 Order Confirmation\n\nOrder ID: ${orderData.id}\nTotal: $${orderData.total}\nItems: ${orderData.items.length}\n\nThank you for your order!`
      },
      {
        type: 'flex',
        altText: 'Order Details',
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
              ...orderData.items.slice(0, 5).map(item => ({
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
              })),
              ...(orderData.items.length > 5 ? [{
                type: 'text',
                text: `... and ${orderData.items.length - 5} more items`,
                size: 'sm',
                color: '#999999',
                margin: 'sm'
              }] : [])
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
      }
    ];

    try {
      await liffService.sendMessages(messages);
      console.log('Order details sent via LIFF');
    } catch (error) {
      console.error('Failed to send order details via LIFF:', error);
      throw error;
    }
  }

  async sendSimpleMessage(text) {
    if (!liffService.isLoggedIn()) {
      throw new Error('User must be logged in to send messages');
    }

    const message = {
      type: 'text',
      text: text
    };

    try {
      await liffService.sendMessages([message]);
      console.log('Simple message sent via LIFF');
    } catch (error) {
      console.error('Failed to send simple message via LIFF:', error);
      throw error;
    }
  }

  async getUserProfile() {
    if (!liffService.isLoggedIn()) {
      throw new Error('User must be logged in to get profile');
    }

    try {
      const profile = await liffService.getProfile();
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  isLoggedIn() {
    return liffService.isLoggedIn();
  }
}

export const lineMessagingService = new LineMessagingService();
export default lineMessagingService;