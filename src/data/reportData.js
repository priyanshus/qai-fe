// Adding ID and risk level to the JSON data for UI display
const reportData = {
  "summary": "Test file modification in MovieDB application",
  "features_impacted": [
    "Application Testing Framework",
    "Test Execution Pipeline"
  ],
  "modules_impacted": [
    "Test Suite",
    "Application Context Loading"
  ],
  "code_symbols_impacted": {
    "src/test/java/com/ee/md/moviedb/MoviedbApplicationTests.java": [
      "(unknown symbols)"
    ]
  },
  "risk_hotspots": [
    {
      "file": "src/test/java/com/ee/md/moviedb/MoviedbApplicationTests.java",
      "reason": "Test configuration changes may affect application startup validation",
      "severity": "Medium",
      "likelihood": "Low"
    }
  ],
  "qa_scenarios": [
    {
      "title": "Verify application context loads successfully",
      "objective": "Ensure the Spring Boot application context loads without errors after test modifications",
      "steps": [
        "Execute the MoviedbApplicationTests class",
        "Verify contextLoads test method executes",
        "Check for any Spring context initialization errors"
      ],
      "expected": "Application context should load successfully without any exceptions",
      "priority": "High",
      "tags": [
        "integration",
        "context"
      ],
      "id": "TC001",
      "risk": "High"
    },
    {
      "title": "Run complete test suite",
      "objective": "Validate that all existing tests continue to pass after modifications",
      "steps": [
        "Execute mvn test command",
        "Review test execution results",
        "Check for any failing tests"
      ],
      "expected": "All tests should pass successfully",
      "priority": "High",
      "tags": [
        "regression",
        "suite"
      ],
      "id": "TC002",
      "risk": "High"
    },
    {
      "title": "Verify application startup in different profiles",
      "objective": "Ensure application starts correctly across different Spring profiles",
      "steps": [
        "Run tests with default profile",
        "Run tests with test profile",
        "Run tests with production profile configuration"
      ],
      "expected": "Application should start successfully in all configured profiles",
      "priority": "Medium",
      "tags": [
        "profiles",
        "configuration"
      ],
      "id": "TC003",
      "risk": "Medium"
    },
    {
      "title": "Validate test coverage metrics",
      "objective": "Ensure test coverage remains adequate after modifications",
      "steps": [
        "Execute tests with coverage reporting",
        "Generate coverage report",
        "Compare with previous coverage metrics"
      ],
      "expected": "Test coverage should meet or exceed established thresholds",
      "priority": "Medium",
      "tags": [
        "coverage",
        "metrics"
      ],
      "id": "TC004",
      "risk": "Medium"
    },
    {
      "title": "Test CI/CD pipeline integration",
      "objective": "Verify that modified tests work correctly in automated build pipeline",
      "steps": [
        "Trigger automated build",
        "Monitor test execution in pipeline",
        "Verify build completion status"
      ],
      "expected": "Pipeline should complete successfully with all tests passing",
      "priority": "High",
      "tags": [
        "pipeline",
        "automation"
      ],
      "id": "TC005",
      "risk": "High"
    },
    {
      "title": "Verify database connectivity in tests",
      "objective": "Ensure database-related tests function correctly after modifications",
      "steps": [
        "Execute database integration tests",
        "Verify database connections are established",
        "Check data persistence operations"
      ],
      "expected": "All database operations should complete successfully",
      "priority": "Medium",
      "tags": [
        "database",
        "integration"
      ],
      "id": "TC006",
      "risk": "Low"
    }
  ],
  "overallRisk": "Medium"
};

export default reportData;
