# Logging Configuration
#
# PURPOSE:
# - Set up structured logging for the service
# - Configure log format, level, handlers
#
# IMPLEMENTATION STEPS:
# 1. Import logging, sys
# 2. Create setup_logging() function
# 3. Configure logging format:
#    - Include: timestamp, logger name, level, message
#    - Format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# 4. Set log level based on environment (INFO for prod, DEBUG for dev)
# 5. Add console handler (sys.stdout)
# 6. Optional: Add file handler for persistent logs
#
# EXAMPLE:
# import logging
#
# def setup_logging(level=logging.INFO):
#     logging.basicConfig(
#         level=level,
#         format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#         handlers=[logging.StreamHandler(sys.stdout)]
#     )
#
# USAGE:
# from app.utils.logger import setup_logging
# setup_logging()
# logger = logging.getLogger(__name__)
# logger.info("Service started")
