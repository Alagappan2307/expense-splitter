USE `helpdesk_db`;

INSERT INTO `tickets` (`requester_name`, `requester_email`, `title`, `description`, `priority`, `status`, `created_at`, `updated_at`) VALUES
('Alagappan K', 'alagappan@krce.ac.in', 'VPN Connection Gateway Timeout', 'Unable to establish secure tunnel to lab network after certificate update.', 'HIGH', 'OPEN', NOW(), NOW()),
('Kevin Xavier F', 'kevin@krce.ac.in', 'Database Migration Access Required', 'Need read-write credentials on MySQL staging replica for review demo.', 'CRITICAL', 'IN_PROGRESS', NOW(), NOW()),
('Priya Dharshini', 'priya.d@sample.org', 'Request IDE License Renewal', 'Student developer edition subscription expired this week.', 'LOW', 'RESOLVED', NOW(), NOW()),
('Arun Kumar', 'arun.k@sample.org', 'Projector HDMI flickering in IT Seminar Hall', 'Display output cuts off periodically every 5 minutes during presentations.', 'MEDIUM', 'OPEN', NOW(), NOW());

INSERT INTO `ticket_history` (`ticket_id`, `action`, `timestamp`) VALUES
(1, 'Ticket created at 2026-10-09 10:00', NOW()),
(2, 'Ticket created at 2026-10-09 10:30', NOW()),
(2, 'Status changed to In Progress at 2026-10-09 11:15', NOW()),
(3, 'Ticket created at 2026-10-09 09:00', NOW()),
(3, 'Status changed to Resolved at 2026-10-09 12:45', NOW()),
(4, 'Ticket created at 2026-10-09 14:10', NOW());
