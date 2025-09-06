export interface BrightDataRawProfile {
  url?: string;
  name?: string;
  headline?: string;
  location?: string;
  summary?: string;
  current_position?: {
    title?: string;
    company?: string;
    start_date?: string;
    description?: string;
  };
  experience?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    field?: string;
    start_date?: string;
    end_date?: string;
  }>;
  skills?: string[];
  languages?: string[];
  certifications?: Array<{
    name?: string;
    authority?: string;
    date?: string;
  }>;
  recommendations?: number;
  connections?: number;
  followers?: number;
  profile_image?: string;
  banner_image?: string;
  about?: string;
  activity?: {
    posts?: Array<{
      text?: string;
      date?: string;
      likes?: number;
      comments?: number;
    }>;
    articles?: Array<{
      title?: string;
      date?: string;
      url?: string;
    }>;
  };
  company_details?: {
    name?: string;
    size?: string;
    industry?: string;
    type?: string;
    headquarters?: string;
    website?: string;
    founded?: string;
    specialties?: string[];
  };
  mutual_connections?: Array<{
    name?: string;
    title?: string;
    profile_url?: string;
  }>;
}

export interface EnrichedProfile {
  profileId: string;
  lastUpdated: string;
  dataSource: 'bright_data' | 'apify' | 'manual';
  confidenceScore: number;
  completenessScore: number;
  
  basicInfo: {
    fullName: string;
    headline: string;
    location: string;
    profileUrl: string;
    publicId: string;
    profileImageUrl?: string;
    bannerImageUrl?: string;
  };
  
  professional: {
    currentPosition: {
      title: string;
      company: string;
      startDate: string;
      duration?: string;
      description?: string;
    };
    previousRoles: Array<{
      title: string;
      company: string;
      startDate?: string;
      endDate?: string;
      duration?: string;
      description?: string;
    }>;
    totalExperience: number; // in months
    careerProgression: string[]; // company names in order
  };
  
  education: {
    degrees: Array<{
      type: string;
      field: string;
      institution: string;
      graduationYear?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      dateObtained?: string;
    }>;
  };
  
  skills: {
    endorsed: string[];
    categories: {
      technical: string[];
      soft: string[];
      industry: string[];
    };
    topSkills: string[]; // top 5 most relevant
  };
  
  network: {
    connectionsCount: number;
    followersCount: number;
    mutualConnections: Array<{
      name: string;
      title: string;
      profileUrl: string;
    }>;
  };
  
  activity: {
    lastActive?: string;
    recentPosts: Array<{
      content: string;
      timestamp: string;
      engagement: {
        likes: number;
        comments: number;
      };
    }>;
    publishedArticles: Array<{
      title: string;
      url: string;
      publishDate: string;
    }>;
  };
  
  companyIntelligence: {
    currentCompany: {
      name: string;
      size?: string;
      industry?: string;
      type?: string;
      headquarters?: string;
      website?: string;
      founded?: string;
      specialties?: string[];
      employeeCount?: string;
      fundingStage?: string;
      technologies?: string[];
    };
  };
  
  enrichmentMetadata: {
    scraperVersion: string;
    extractionTimestamp: string;
    dataPoints: number;
    missingFields: string[];
    enrichmentCost?: number;
    processingTime?: number;
  };
}

export class BrightDataTransformer {
  private static readonly SCRAPER_VERSION = '1.0.0';
  
  static transform(rawData: BrightDataRawProfile): EnrichedProfile {
    const extractionTimestamp = new Date().toISOString();
    const profileId = this.extractProfileId(rawData.url || '');
    
    const basicInfo = this.transformBasicInfo(rawData);
    const professional = this.transformProfessional(rawData);
    const education = this.transformEducation(rawData);
    const skills = this.transformSkills(rawData);
    const network = this.transformNetwork(rawData);
    const activity = this.transformActivity(rawData);
    const companyIntelligence = this.transformCompanyIntel(rawData);
    
    const { completenessScore, missingFields, dataPoints } = this.calculateCompleteness(rawData);
    const confidenceScore = this.calculateConfidence(rawData, completenessScore);
    
    return {
      profileId,
      lastUpdated: extractionTimestamp,
      dataSource: 'bright_data',
      confidenceScore,
      completenessScore,
      basicInfo,
      professional,
      education,
      skills,
      network,
      activity,
      companyIntelligence,
      enrichmentMetadata: {
        scraperVersion: this.SCRAPER_VERSION,
        extractionTimestamp,
        dataPoints,
        missingFields,
        enrichmentCost: 0.08, // Bright Data approximate cost per profile
        processingTime: 0
      }
    };
  }
  
  private static extractProfileId(url: string): string {
    const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
    return match ? match[1] : this.generateProfileId();
  }
  
  private static generateProfileId(): string {
    return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static transformBasicInfo(raw: BrightDataRawProfile) {
    return {
      fullName: raw.name || 'Unknown',
      headline: raw.headline || '',
      location: raw.location || '',
      profileUrl: raw.url || '',
      publicId: this.extractProfileId(raw.url || ''),
      profileImageUrl: raw.profile_image,
      bannerImageUrl: raw.banner_image
    };
  }
  
  private static transformProfessional(raw: BrightDataRawProfile) {
    const currentPosition = raw.current_position ? {
      title: raw.current_position.title || '',
      company: raw.current_position.company || '',
      startDate: raw.current_position.start_date || '',
      duration: this.calculateDuration(raw.current_position.start_date),
      description: raw.current_position.description
    } : {
      title: '',
      company: '',
      startDate: '',
      duration: undefined,
      description: undefined
    };
    
    const previousRoles = (raw.experience || [])
      .filter(exp => exp.title !== currentPosition.title || exp.company !== currentPosition.company)
      .map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        startDate: exp.start_date,
        endDate: exp.end_date,
        duration: exp.duration,
        description: exp.description
      }));
    
    const totalExperience = this.calculateTotalExperience(raw.experience || []);
    const careerProgression = this.extractCareerProgression(raw.experience || []);
    
    return {
      currentPosition,
      previousRoles,
      totalExperience,
      careerProgression
    };
  }
  
  private static transformEducation(raw: BrightDataRawProfile) {
    const degrees = (raw.education || []).map(edu => ({
      type: this.inferDegreeType(edu.degree || ''),
      field: edu.field || edu.degree || '',
      institution: edu.school || '',
      graduationYear: edu.end_date
    }));
    
    const certifications = (raw.certifications || []).map(cert => ({
      name: cert.name || '',
      issuer: cert.authority || '',
      dateObtained: cert.date
    }));
    
    return { degrees, certifications };
  }
  
  private static transformSkills(raw: BrightDataRawProfile) {
    const allSkills = raw.skills || [];
    const { technical, soft, industry } = this.categorizeSkills(allSkills);
    
    return {
      endorsed: allSkills,
      categories: { technical, soft, industry },
      topSkills: allSkills.slice(0, 5)
    };
  }
  
  private static transformNetwork(raw: BrightDataRawProfile) {
    return {
      connectionsCount: raw.connections || 0,
      followersCount: raw.followers || 0,
      mutualConnections: (raw.mutual_connections || []).map(conn => ({
        name: conn.name || '',
        title: conn.title || '',
        profileUrl: conn.profile_url || ''
      }))
    };
  }
  
  private static transformActivity(raw: BrightDataRawProfile) {
    const recentPosts = (raw.activity?.posts || []).map(post => ({
      content: post.text || '',
      timestamp: post.date || '',
      engagement: {
        likes: post.likes || 0,
        comments: post.comments || 0
      }
    }));
    
    const publishedArticles = (raw.activity?.articles || []).map(article => ({
      title: article.title || '',
      url: article.url || '',
      publishDate: article.date || ''
    }));
    
    const lastActive = this.determineLastActive(recentPosts);
    
    return {
      lastActive,
      recentPosts,
      publishedArticles
    };
  }
  
  private static transformCompanyIntel(raw: BrightDataRawProfile) {
    const company = raw.company_details || {};
    
    return {
      currentCompany: {
        name: company.name || raw.current_position?.company || '',
        size: company.size,
        industry: company.industry,
        type: company.type,
        headquarters: company.headquarters,
        website: company.website,
        founded: company.founded,
        specialties: company.specialties,
        employeeCount: this.parseEmployeeCount(company.size),
        fundingStage: this.inferFundingStage(company.type),
        technologies: this.extractTechnologies(company.specialties || [])
      }
    };
  }
  
  private static calculateDuration(startDate?: string): string | undefined {
    if (!startDate) return undefined;
    
    const start = new Date(startDate);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  
  private static calculateTotalExperience(experience: any[]): number {
    let totalMonths = 0;
    
    experience.forEach(exp => {
      if (exp.start_date) {
        const start = new Date(exp.start_date);
        const end = exp.end_date ? new Date(exp.end_date) : new Date();
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += months;
      }
    });
    
    return totalMonths;
  }
  
  private static extractCareerProgression(experience: any[]): string[] {
    return experience
      .sort((a, b) => {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return dateB - dateA;
      })
      .map(exp => exp.company)
      .filter((company, index, self) => company && self.indexOf(company) === index);
  }
  
  private static inferDegreeType(degree: string): string {
    const normalized = degree.toLowerCase();
    if (normalized.includes('phd') || normalized.includes('doctor')) return 'PhD';
    if (normalized.includes('master') || normalized.includes('mba')) return 'Masters';
    if (normalized.includes('bachelor') || normalized.includes('bs') || normalized.includes('ba')) return 'Bachelors';
    if (normalized.includes('associate')) return 'Associates';
    return 'Certificate';
  }
  
  private static categorizeSkills(skills: string[]) {
    const technical: string[] = [];
    const soft: string[] = [];
    const industry: string[] = [];
    
    const techKeywords = ['programming', 'software', 'data', 'cloud', 'api', 'database', 'javascript', 'python', 'java', 'aws', 'azure', 'docker', 'kubernetes'];
    const softKeywords = ['leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking', 'presentation', 'negotiation', 'management'];
    
    skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (techKeywords.some(keyword => skillLower.includes(keyword))) {
        technical.push(skill);
      } else if (softKeywords.some(keyword => skillLower.includes(keyword))) {
        soft.push(skill);
      } else {
        industry.push(skill);
      }
    });
    
    return { technical, soft, industry };
  }
  
  private static determineLastActive(posts: any[]): string | undefined {
    if (!posts || posts.length === 0) return undefined;
    
    const sortedPosts = posts
      .filter(post => post.timestamp)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return sortedPosts[0]?.timestamp;
  }
  
  private static parseEmployeeCount(size?: string): string | undefined {
    if (!size) return undefined;
    
    const sizeMap: { [key: string]: string } = {
      'self-employed': '1',
      '1-10': '1-10',
      '11-50': '11-50',
      '51-200': '51-200',
      '201-500': '201-500',
      '501-1000': '501-1000',
      '1001-5000': '1001-5000',
      '5001-10000': '5001-10000',
      '10001+': '10000+'
    };
    
    const normalized = size.toLowerCase();
    for (const [key, value] of Object.entries(sizeMap)) {
      if (normalized.includes(key)) return value;
    }
    
    return size;
  }
  
  private static inferFundingStage(type?: string): string | undefined {
    if (!type) return undefined;
    
    const typeLower = type.toLowerCase();
    if (typeLower.includes('public')) return 'Public';
    if (typeLower.includes('private')) return 'Private';
    if (typeLower.includes('startup')) return 'Startup';
    if (typeLower.includes('non-profit')) return 'Non-Profit';
    
    return undefined;
  }
  
  private static extractTechnologies(specialties: string[]): string[] {
    const techKeywords = [
      'javascript', 'python', 'java', 'react', 'node.js', 'aws', 'azure', 'docker',
      'kubernetes', 'mongodb', 'postgresql', 'redis', 'elasticsearch', 'graphql',
      'tensorflow', 'pytorch', 'spark', 'hadoop', 'kafka', 'rabbitmq'
    ];
    
    const technologies: string[] = [];
    
    specialties.forEach(specialty => {
      const specialtyLower = specialty.toLowerCase();
      techKeywords.forEach(tech => {
        if (specialtyLower.includes(tech) && !technologies.includes(tech)) {
          technologies.push(tech);
        }
      });
    });
    
    return technologies;
  }
  
  private static calculateCompleteness(raw: BrightDataRawProfile): {
    completenessScore: number;
    missingFields: string[];
    dataPoints: number;
  } {
    const fields = [
      { key: 'name', value: raw.name, weight: 10 },
      { key: 'headline', value: raw.headline, weight: 8 },
      { key: 'location', value: raw.location, weight: 5 },
      { key: 'summary', value: raw.summary || raw.about, weight: 7 },
      { key: 'current_position', value: raw.current_position?.title, weight: 10 },
      { key: 'experience', value: raw.experience?.length, weight: 9 },
      { key: 'education', value: raw.education?.length, weight: 6 },
      { key: 'skills', value: raw.skills?.length, weight: 8 },
      { key: 'connections', value: raw.connections, weight: 4 },
      { key: 'profile_image', value: raw.profile_image, weight: 3 },
      { key: 'company_details', value: raw.company_details?.name, weight: 5 },
      { key: 'activity', value: raw.activity?.posts?.length, weight: 4 },
      { key: 'certifications', value: raw.certifications?.length, weight: 3 },
      { key: 'recommendations', value: raw.recommendations, weight: 2 },
      { key: 'languages', value: raw.languages?.length, weight: 2 }
    ];
    
    const missingFields: string[] = [];
    let totalWeight = 0;
    let achievedWeight = 0;
    let dataPoints = 0;
    
    fields.forEach(field => {
      totalWeight += field.weight;
      if (field.value) {
        achievedWeight += field.weight;
        dataPoints++;
      } else {
        missingFields.push(field.key);
      }
    });
    
    const completenessScore = Math.round((achievedWeight / totalWeight) * 100);
    
    return {
      completenessScore,
      missingFields,
      dataPoints
    };
  }
  
  private static calculateConfidence(raw: BrightDataRawProfile, completenessScore: number): number {
    let confidence = completenessScore;
    
    // Boost confidence for verified data points
    if (raw.profile_image) confidence += 2;
    if (raw.current_position?.company) confidence += 3;
    if ((raw.experience?.length || 0) > 3) confidence += 3;
    if ((raw.skills?.length || 0) > 5) confidence += 2;
    
    // Cap at 100
    return Math.min(confidence, 100);
  }
  
  static validateTransformedData(profile: EnrichedProfile): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!profile.profileId) errors.push('Missing profile ID');
    if (!profile.basicInfo.fullName) errors.push('Missing full name');
    if (!profile.basicInfo.profileUrl) errors.push('Missing profile URL');
    if (profile.completenessScore < 30) errors.push('Profile completeness below minimum threshold');
    if (profile.confidenceScore < 40) errors.push('Confidence score below minimum threshold');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class DataNormalizer {
  static normalizeDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return undefined;
      return date.toISOString();
    } catch {
      return undefined;
    }
  }
  
  static normalizeUrl(url?: string): string | undefined {
    if (!url) return undefined;
    
    try {
      const parsed = new URL(url);
      return parsed.href;
    } catch {
      // Try to fix common issues
      if (!url.startsWith('http')) {
        return `https://${url}`;
      }
      return undefined;
    }
  }
  
  static sanitizeText(text?: string): string {
    if (!text) return '';
    
    return text
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }
  
  static extractNumbers(text?: string): number | undefined {
    if (!text) return undefined;
    
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : undefined;
  }
}