using System;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PW.Application.Repositories;
using PW.Persistence.Context;

namespace PW.Persistence.Repositories;

public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly PWDbContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(PWDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<T> GetByIdAsync(Guid id) => await _dbSet.FindAsync(id);

        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
            await _dbSet.Where(predicate).ToListAsync();

        public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

        public void Update(T entity) => _dbSet.Update(entity);

        public void Remove(T entity) => _dbSet.Remove(entity);

}
