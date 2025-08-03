export class QueueNames {
  // Common queues
  static readonly dailyQueue = "{daily-queue}";
  static readonly csvMenuQueue = "{csv-menu-queue}";
  static readonly cloverMenuQueue = "{clover-menu-queue}";
  static readonly menuQueue = "{menu-queue}";
  static readonly activityLogQueue = "{activity-log-queue}";
  static readonly adminQueue = "{admin-queue}";

  // SMS related queues
  static readonly smsQueue = "{sms-queue}";

  // Email related queues
  static readonly emailQueue = "{email-queue}";
  static readonly customerEmailQueue = "{customer-email-queue}";

  static readonly resCampaignsQueue = "{res-campaigns-queue}";
  static readonly resCampaignsAnalyticsQueue =
    "{res-campaigns-analytics-queue}";
  static readonly resCampaignsEmailQueue = "{res-campaigns-email-queue}";
  static readonly resCampaignsTestEmailQueue =
    "{res-campaigns-test-email-queue}";

  static readonly internalCampaignsQueue = "{internal-campaigns-queue}";
  static readonly internalCampaignsTestEmailQueue =
    "{internal-campaigns-test-email-queue}";

  static readonly campaignsQueue = "{campaigns-queue}";
  static readonly campaignsEmailQueue = "{campaigns-email-queue}";

  // Website builder and deployment related queues
  static readonly websiteBuilderQueue = "{website-builder-queue}";

  // - Restaurant website contact form queue
  static readonly contactFormQueue = "{contact-form-queue}";

  // - Customer abandoned cart queue
  static readonly abandonedCartQueue = "{abandoned-cart-queue}";

  // - Customer order placed queue
  static readonly ordersQueue = "{orders-queue}";

  // - Customer payment processing queue
  static readonly resPaymentsQueue = "{res-payments-queue}";

  // Restaurant owner stripe subscription queue
  static readonly paymentsQueue = "{payments-queue}";

  //Delivery Related
  static readonly deliveryIntegrationQueue = "{delivery-integration-queue}";
}
