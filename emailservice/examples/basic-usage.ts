import { OrbitMailEmailService } from '../dist/index';

async function basicEmailExample() {
  console.log('🚀 Starting OrbitMail Email Service Example...\n');

  // Initialize the email service
  const emailService = new OrbitMailEmailService();

  try {
    // 1. Add a domain
    console.log('📧 Adding domain: example.com');
    await emailService.addDomain('example.com', ['mx1.example.com', 'mx2.example.com']);
    console.log('✅ Domain added successfully\n');

    // 2. Send an email
    console.log('📤 Sending email...');
    const jobId = await emailService.sendFromDomain(
      'user@example.com',
      'recipient@gmail.com',
      'Test Email from OrbitMail',
      'Hello! This is a test email sent using our custom email service.'
    );
    console.log(`✅ Email queued with job ID: ${jobId}\n`);

    // 3. Check job status
    console.log('📊 Checking job status...');
    const jobStatus = emailService.getJobStatus(jobId);
    console.log('Job Status:', jobStatus);
    console.log('');

    // 4. Get queue statistics
    console.log('📈 Queue Statistics:');
    const stats = emailService.getQueueStats();
    console.log(stats);
    console.log('');

    // 5. Get service status
    console.log('🔍 Service Status:');
    const status = emailService.getStatus();
    console.log(status);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example
basicEmailExample().catch(console.error); 