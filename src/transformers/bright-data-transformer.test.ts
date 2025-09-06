import { BrightDataTransformer, DataNormalizer } from './bright-data-transformer';
import type { BrightDataRawProfile, EnrichedProfile } from './bright-data-transformer';

describe('BrightDataTransformer', () => {
  describe('transform', () => {
    it('should transform a complete profile correctly', () => {
      const rawProfile: BrightDataRawProfile = {
        url: 'https://www.linkedin.com/in/john-doe',
        name: 'John Doe',
        headline: 'Senior Software Engineer at TechCorp',
        location: 'San Francisco, CA',
        summary: 'Experienced software engineer with 10+ years in the industry',
        current_position: {
          title: 'Senior Software Engineer',
          company: 'TechCorp',
          start_date: '2020-01-01',
          description: 'Leading backend development team'
        },
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'TechCorp',
            start_date: '2020-01-01',
            description: 'Leading backend development'
          },
          {
            title: 'Software Engineer',
            company: 'StartupXYZ',
            start_date: '2015-06-01',
            end_date: '2019-12-31',
            description: 'Full-stack development'
          }
        ],
        education: [
          {
            school: 'MIT',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            start_date: '2011-09-01',
            end_date: '2015-05-31'
          }
        ],
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Leadership', 'Team Management'],
        connections: 500,
        followers: 1200,
        profile_image: 'https://example.com/profile.jpg',
        company_details: {
          name: 'TechCorp',
          size: '1001-5000',
          industry: 'Technology',
          type: 'Private',
          headquarters: 'San Francisco, CA',
          website: 'https://techcorp.com'
        }
      };
      
      const result = BrightDataTransformer.transform(rawProfile);
      
      expect(result.profileId).toBe('john-doe');
      expect(result.dataSource).toBe('bright_data');
      expect(result.basicInfo.fullName).toBe('John Doe');
      expect(result.basicInfo.headline).toBe('Senior Software Engineer at TechCorp');
      expect(result.professional.currentPosition.title).toBe('Senior Software Engineer');
      expect(result.professional.currentPosition.company).toBe('TechCorp');
      expect(result.professional.previousRoles).toHaveLength(1);
      expect(result.education.degrees).toHaveLength(1);
      expect(result.education.degrees[0].type).toBe('Bachelors');
      expect(result.skills.endorsed).toHaveLength(7);
      expect(result.skills.categories.technical).toContain('JavaScript');
      expect(result.skills.categories.soft).toContain('Leadership');
      expect(result.network.connectionsCount).toBe(500);
      expect(result.network.followersCount).toBe(1200);
      expect(result.companyIntelligence.currentCompany.name).toBe('TechCorp');
      expect(result.companyIntelligence.currentCompany.employeeCount).toBe('1001-5000');
      expect(result.completenessScore).toBeGreaterThan(70);
      expect(result.confidenceScore).toBeGreaterThan(70);
    });
    
    it('should handle incomplete profile data gracefully', () => {
      const rawProfile: BrightDataRawProfile = {
        url: 'https://www.linkedin.com/in/jane-smith',
        name: 'Jane Smith',
        headline: 'Product Manager'
      };
      
      const result = BrightDataTransformer.transform(rawProfile);
      
      expect(result.profileId).toBe('jane-smith');
      expect(result.basicInfo.fullName).toBe('Jane Smith');
      expect(result.basicInfo.headline).toBe('Product Manager');
      expect(result.basicInfo.location).toBe('');
      expect(result.professional.currentPosition.title).toBe('');
      expect(result.professional.currentPosition.company).toBe('');
      expect(result.professional.previousRoles).toHaveLength(0);
      expect(result.education.degrees).toHaveLength(0);
      expect(result.skills.endorsed).toHaveLength(0);
      expect(result.completenessScore).toBeLessThan(30);
      expect(result.enrichmentMetadata.missingFields.length).toBeGreaterThan(10);
    });
    
    it('should calculate experience duration correctly', () => {
      const rawProfile: BrightDataRawProfile = {
        url: 'https://www.linkedin.com/in/test-user',
        name: 'Test User',
        current_position: {
          title: 'Engineer',
          company: 'Company',
          start_date: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString()
        }
      };
      
      const result = BrightDataTransformer.transform(rawProfile);
      
      expect(result.professional.currentPosition.duration).toContain('2 years');
    });
    
    it('should categorize skills correctly', () => {
      const rawProfile: BrightDataRawProfile = {
        url: 'https://www.linkedin.com/in/test-user',
        name: 'Test User',
        skills: [
          'JavaScript',
          'Python',
          'Leadership',
          'Communication',
          'Healthcare',
          'Finance',
          'AWS',
          'Problem Solving'
        ]
      };
      
      const result = BrightDataTransformer.transform(rawProfile);
      
      expect(result.skills.categories.technical).toContain('JavaScript');
      expect(result.skills.categories.technical).toContain('Python');
      expect(result.skills.categories.technical).toContain('AWS');
      expect(result.skills.categories.soft).toContain('Leadership');
      expect(result.skills.categories.soft).toContain('Communication');
      expect(result.skills.categories.soft).toContain('Problem Solving');
      expect(result.skills.categories.industry).toContain('Healthcare');
      expect(result.skills.categories.industry).toContain('Finance');
    });
    
    it('should extract profile ID from various URL formats', () => {
      const testCases = [
        {
          url: 'https://www.linkedin.com/in/john-doe',
          expected: 'john-doe'
        },
        {
          url: 'https://linkedin.com/in/jane-smith-123/',
          expected: 'jane-smith-123'
        },
        {
          url: 'https://www.linkedin.com/in/user-name?param=value',
          expected: 'user-name'
        }
      ];
      
      testCases.forEach(({ url, expected }) => {
        const result = BrightDataTransformer.transform({ url, name: 'Test' });
        expect(result.profileId).toBe(expected);
      });
    });
    
    it('should validate transformed data correctly', () => {
      const validProfile: EnrichedProfile = BrightDataTransformer.transform({
        url: 'https://www.linkedin.com/in/john-doe',
        name: 'John Doe',
        headline: 'Engineer',
        experience: [{ title: 'Engineer', company: 'Company' }],
        skills: ['Skill1', 'Skill2', 'Skill3']
      });
      
      const validation = BrightDataTransformer.validateTransformedData(validProfile);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      
      const invalidProfile = { ...validProfile, profileId: '', basicInfo: { ...validProfile.basicInfo, fullName: '' } };
      const invalidValidation = BrightDataTransformer.validateTransformedData(invalidProfile);
      expect(invalidValidation.isValid).toBe(false);
      expect(invalidValidation.errors).toContain('Missing profile ID');
      expect(invalidValidation.errors).toContain('Missing full name');
    });
  });
});

describe('DataNormalizer', () => {
  describe('normalizeDate', () => {
    it('should normalize valid dates to ISO format', () => {
      expect(DataNormalizer.normalizeDate('2023-01-15')).toMatch(/2023-01-15T/);
      expect(DataNormalizer.normalizeDate('Jan 15, 2023')).toMatch(/2023-01-15T/);
      expect(DataNormalizer.normalizeDate('2023/01/15')).toMatch(/2023-01-15T/);
    });
    
    it('should return undefined for invalid dates', () => {
      expect(DataNormalizer.normalizeDate('invalid')).toBeUndefined();
      expect(DataNormalizer.normalizeDate('')).toBeUndefined();
      expect(DataNormalizer.normalizeDate(undefined)).toBeUndefined();
    });
  });
  
  describe('normalizeUrl', () => {
    it('should normalize URLs correctly', () => {
      expect(DataNormalizer.normalizeUrl('https://example.com')).toBe('https://example.com/');
      expect(DataNormalizer.normalizeUrl('example.com')).toBe('https://example.com/');
      expect(DataNormalizer.normalizeUrl('http://example.com/path')).toBe('http://example.com/path');
    });
    
    it('should return undefined for invalid URLs', () => {
      expect(DataNormalizer.normalizeUrl('')).toBeUndefined();
      expect(DataNormalizer.normalizeUrl(undefined)).toBeUndefined();
    });
  });
  
  describe('sanitizeText', () => {
    it('should remove control characters and normalize whitespace', () => {
      expect(DataNormalizer.sanitizeText('Hello\x00World')).toBe('Hello World');
      expect(DataNormalizer.sanitizeText('  Multiple   Spaces  ')).toBe('Multiple Spaces');
      expect(DataNormalizer.sanitizeText('\nNew\nLines\n')).toBe('New Lines');
    });
    
    it('should return empty string for undefined input', () => {
      expect(DataNormalizer.sanitizeText(undefined)).toBe('');
      expect(DataNormalizer.sanitizeText('')).toBe('');
    });
  });
  
  describe('extractNumbers', () => {
    it('should extract numbers from text', () => {
      expect(DataNormalizer.extractNumbers('500+ connections')).toBe(500);
      expect(DataNormalizer.extractNumbers('Founded in 2020')).toBe(2020);
      expect(DataNormalizer.extractNumbers('10,000 employees')).toBe(10);
    });
    
    it('should return undefined for text without numbers', () => {
      expect(DataNormalizer.extractNumbers('No numbers here')).toBeUndefined();
      expect(DataNormalizer.extractNumbers('')).toBeUndefined();
      expect(DataNormalizer.extractNumbers(undefined)).toBeUndefined();
    });
  });
});