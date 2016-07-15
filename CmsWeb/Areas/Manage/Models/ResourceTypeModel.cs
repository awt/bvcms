﻿using CmsData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CmsWeb.Areas.Manage.Models
{
    public class ResourceTypeModel
    {
        public ResourceType ResourceType { get; set; }
        public IEnumerable<Resource> Resources { get; set; }
        public ResourceTypeModel(ResourceType resourceType)
        {
            ResourceType = resourceType;
            Resources = resourceType.Resources;
        }

        public ResourceTypeModel(ResourceType resourceType, IEnumerable<Resource> resources)
        {
            ResourceType = resourceType;
            Resources = resources;
        }
    }
}