import express from 'express';
import { OrbitMailEmailService } from '../dist/index';

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize email service
const emailService = new OrbitMailEmailService();

// Email service routes
app.post('/api/email/send', async (req, res) => {
  try {
    const { from, to, subject, text } = req.body;

    // Validate required fields
    if (!from || !to || !subject || !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: from, to, subject, text'
      });
    }

    // Send email
    const jobId = await emailService.sendFromDomain(from, to, subject, text);

    res.json({
      success: true,
      jobId,
      message: 'Email queued for sending'
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/domain/add', async (req, res) => {
  try {
    const { domain, mxRecords } = req.body;

    if (!domain || !mxRecords) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: domain, mxRecords'
      });
    }

    await emailService.addDomain(domain, mxRecords);

    res.json({
      success: true,
      message: `Domain ${domain} added successfully`
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/domain/verify/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const isValid = await emailService.verifyDomain(domain);

    res.json({
      success: true,
      domain,
      isValid
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/email/status/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    const jobStatus = emailService.getJobStatus(jobId);

    if (!jobStatus) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      jobStatus
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/email/queue/stats', (req, res) => {
  try {
    const stats = emailService.getQueueStats();

    res.json({
      success: true,
      stats
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/email/service/status', (req, res) => {
  try {
    const status = emailService.getStatus();

    res.json({
      success: true,
      status
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/email/queue/retry', (req, res) => {
  try {
    const retryCount = emailService.retryFailedJobs();

    res.json({
      success: true,
      retryCount,
      message: `${retryCount} failed jobs retried`
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete('/api/email/queue/clear', (req, res) => {
  try {
    const clearedCount = emailService.clearCompletedJobs();

    res.json({
      success: true,
      clearedCount,
      message: `${clearedCount} completed jobs cleared`
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OrbitMail Email Service',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 OrbitMail Email Service running on port ${PORT}`);
  console.log(`📧 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Queue stats: http://localhost:${PORT}/api/email/queue/stats`);
});

export { app, emailService }; 