import { stripe } from '@/services/payment/stripe.config';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Webhook 签名验证
async function verifyWebhookSignature(body: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

// 处理支付成功事件
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  // 这里可以添加业务逻辑，比如：
  // - 更新订单状态
  // - 发送确认邮件
  // - 激活用户权限等
  
  const metadata = paymentIntent.metadata;
  if (metadata.userId) {
    // 处理用户相关的业务逻辑
    console.log('Processing payment for user:', metadata.userId);
  }
}

// 处理订阅事件
async function handleSubscriptionEvent(subscription: Stripe.Subscription, eventType: string) {
  console.log(`Subscription ${eventType}:`, subscription.id);
  
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer.deleted) {
    console.error('Customer was deleted');
    return;
  }
  
  const metadata = subscription.metadata;
  if (metadata.userId) {
    switch (eventType) {
      case 'created':
        // 订阅创建
        console.log('New subscription created for user:', metadata.userId);
        break;
      case 'updated':
        // 订阅更新
        console.log('Subscription updated for user:', metadata.userId);
        break;
      case 'deleted':
        // 订阅取消
        console.log('Subscription cancelled for user:', metadata.userId);
        break;
    }
  }
}

// 处理发票事件
async function handleInvoiceEvent(invoice: Stripe.Invoice, eventType: string) {
  console.log(`Invoice ${eventType}:`, invoice.id);
  
  if (eventType === 'payment_failed') {
    // 支付失败处理
    console.log('Invoice payment failed:', invoice.id);
    // 可以发送邮件通知用户更新支付方式
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return Response.json({ error: 'No signature provided' }, { status: 400 });
    }

    // 验证 Webhook 签名
    const event = await verifyWebhookSignature(body, signature);

    // 处理不同类型的事件
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription, 'created');
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription, 'updated');
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription, 'deleted');
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoiceEvent(event.data.object as Stripe.Invoice, 'payment_succeeded');
        break;
        
      case 'invoice.payment_failed':
        await handleInvoiceEvent(event.data.object as Stripe.Invoice, 'payment_failed');
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}